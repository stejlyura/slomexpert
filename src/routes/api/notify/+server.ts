import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { TELEGRAM_API, USER_ID, TURNSTILE_SECRET_KEY } from '$env/static/private';
import { z } from 'zod';

// In-memory rate limiting (Map<IP, { count: number, resetAt: number }>)
// Note: In production on Cloudflare, it's better to use Cloudflare KV
const rateLimits = new Map<string, { count: number, resetAt: number }>();

// Use secret from env or fallback to testing secret
const TURNSTILE_SECRET = TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';

// --- SCHEMAS ---
const phoneSchema = z.string()
    .transform(val => val.replace(/\D/g, '')) // Remove non-digits
    .pipe(z.string().regex(/^(38)?0\d{9}$/, "Невірний формат номера (очікується 0XXXXXXXXX або 380XXXXXXXXX)"));

const contactSchema = z.object({
    name: z.string().min(2).max(100),
    phone: phoneSchema,
    message: z.string().max(1000).optional(),
    turnstileToken: z.string().optional()
});

const configuratorSchema = z.object({
    userName: z.string().min(2).max(100),
    userPhone: phoneSchema,
    totalPrice: z.union([z.string(), z.number()]),
    details: z.array(z.object({
        label: z.string(),
        qty: z.union([z.string(), z.number()])
    })).optional(),
    turnstileToken: z.string().optional()
});

const reviewSchema = z.object({
    name: z.string().min(2).max(100),
    rating: z.union([z.string(), z.number()]),
    comment: z.string().min(5).max(2000),
    turnstileToken: z.string().optional()
});

/**
 * Basic HTML sanitization for Telegram HTML mode
 */
function sanitize(val: string | number | undefined | null): string {
    if (val === undefined || val === null || val === '') return '';
    return String(val)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

async function verifyTurnstile(token: string | undefined) {
    if (!token) return false;

    const formData = new FormData();
    formData.append('secret', TURNSTILE_SECRET);
    formData.append('response', token);

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        body: formData,
        method: 'POST',
    });

    const outcome = await result.json();
    return outcome.success;
}

export const POST: RequestHandler = async ({ request, cookies, getClientAddress }) => {
    try {
        const clientIp = request.headers.get('cf-connecting-ip') || getClientAddress();
        const payload = await request.json();
        const { type, data, website_url } = payload;

        // 1. Honeypot check
        if (website_url) {
            console.warn(`Honeypot triggered for type: ${type} from ${clientIp}`);
            return json({ success: true, note: 'Spam filtered' });
        }


        // 3. IP-based Rate limiting (max 5 submissions per 24h across all types)
        const now = Date.now();
        const limit = rateLimits.get(clientIp);

        if (limit && now < limit.resetAt) {
            if (limit.count >= 5) {
                return json({
                    success: false,
                    error: 'Занадто багато запитів з вашої IP-адреси. Спробуйте пізніше.'
                }, { status: 429 });
            }
            limit.count++;
        } else {
            rateLimits.set(clientIp, {
                count: 1,
                resetAt: now + (24 * 60 * 60 * 1000)
            });
        }

        // 4. Cookie-based soft limit (per type)
        const limitCookie = `sub_limit_${type}`;
        const cookieCount = parseInt(cookies.get(limitCookie) || '0');
        if (cookieCount >= 2) {
            // We still allow it if IP limit is not reached, but maybe log it
            console.info(`Soft limit (cookie) reached for ${type} from ${clientIp}`);
        }

        let message = '';

        if (type === 'contact') {
            const validated = contactSchema.safeParse(data);
            if (!validated.success) return json({ success: false, error: 'Invalid data' }, { status: 400 });

            const { name, phone, message: msg } = validated.data;
            message = `<b>🔔 Нова заявка на зворотній дзвінок</b>\n\n`;
            message += `👤 <b>Ім'я:</b> ${sanitize(name)}\n`;
            message += `📞 <b>Телефон:</b> <code>${sanitize(phone)}</code>\n`;
            if (msg) message += `💬 <b>Повідомлення:</b> ${sanitize(msg)}\n`;
        }
        else if (type === 'configurator') {
            const validated = configuratorSchema.safeParse(data);
            if (!validated.success) return json({ success: false, error: 'Invalid data' }, { status: 400 });

            const { userName, userPhone, totalPrice, details } = validated.data;
            message = `<b>🛠 Новий розрахунок вартості (Конфігуратор)</b>\n\n`;
            message += `👤 <b>Клієнт:</b> ${sanitize(userName)}\n`;
            message += `📞 <b>Телефон:</b> <code>${sanitize(userPhone)}</code>\n`;
            message += `💰 <b>Попередня сума:</b> ${sanitize(totalPrice)} ₴\n\n`;

            if (details && details.length > 0) {
                message += `📋 <b>Обрані послуги:</b>\n`;
                details.forEach((item) => {
                    message += `• ${sanitize(item.label)}: ${sanitize(item.qty)} шт/м\n`;
                });
            }
        }
        else if (type === 'review') {
            const validated = reviewSchema.safeParse(data);
            if (!validated.success) return json({ success: false, error: 'Invalid data' }, { status: 400 });

            const { name, rating, comment } = validated.data;
            message = `<b>⭐️ Новий відгук на сайті</b>\n\n`;
            message += `👤 <b>Від:</b> ${sanitize(name)}\n`;
            message += `🌟 <b>Оцінка:</b> ${sanitize(rating)} / 5\n`;
            message += `📝 <b>Коментар:</b> ${sanitize(comment)}\n`;
        }
        else {
            return json({ success: false, error: 'Unknown form type' }, { status: 400 });
        }

        const url = `https://api.telegram.org/bot${TELEGRAM_API}/sendMessage`;
        const userIds = USER_ID.split(',').map(id => id.trim());

        const sendPromises = userIds.map(async (chatId) => {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Telegram API Error for ID ${chatId}:`, errorData);
                return { success: false, id: chatId };
            }
            return { success: true, id: chatId };
        });

        const results = await Promise.all(sendPromises);
        const failed = results.filter(r => !r.success);

        if (failed.length === userIds.length) {
            // All failed
            return json({ success: false, error: 'Failed to send Telegram messages' }, { status: 500 });
        }

        // Update rate limit cookie
        cookies.set(limitCookie, (cookieCount + 1).toString(), {
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours
            httpOnly: true,
            sameSite: 'strict'
        });

        return json({ success: true });

    } catch (err) {
        console.error('API Error:', err);
        return json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
};
