import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { TELEGRAM_API, USER_ID } from '$env/static/private';
import { z } from 'zod';

// --- SCHEMAS ---
const contactSchema = z.object({
    name: z.string().min(2).max(100),
    phone: z.string().min(10).max(20),
    message: z.string().max(1000).optional()
});

const configuratorSchema = z.object({
    userName: z.string().min(2).max(100),
    userPhone: z.string().min(10).max(20),
    totalPrice: z.union([z.string(), z.number()]),
    details: z.array(z.object({
        label: z.string(),
        qty: z.union([z.string(), z.number()])
    })).optional()
});

const reviewSchema = z.object({
    name: z.string().min(2).max(100),
    rating: z.union([z.string(), z.number()]),
    comment: z.string().min(5).max(2000)
});

/**
 * Basic HTML sanitization for Telegram HTML mode
 */
function sanitize(str: string | undefined | null): string {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const payload = await request.json();
        const { type, data, website_url } = payload;

        // 1. Honeypot check
        if (website_url) {
            console.warn(`Honeypot triggered for type: ${type}`);
            return json({ success: true, note: 'Spam filtered' });
        }

        // 2. Rate limiting (max 2 submissions per type per 24h)
        const limitCookie = `sub_limit_${type}`;
        const count = parseInt(cookies.get(limitCookie) || '0');

        if (count >= 2) {
            return json({ 
                success: false, 
                error: 'Ви перевищили ліміт повідомлень. Спробуйте пізніше або зателефонуйте нам.' 
            }, { status: 429 });
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
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: USER_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Telegram API Error:', errorData);
            return json({ success: false, error: 'Failed to send Telegram message' }, { status: 500 });
        }

        // Update rate limit cookie
        cookies.set(limitCookie, (count + 1).toString(), {
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
