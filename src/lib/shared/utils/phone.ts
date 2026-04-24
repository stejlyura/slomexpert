/**
 * Formats a raw input string into a Ukrainian phone mask: +38 (0XX) XXX-XX-XX
 */
export function formatUkrainianPhone(input: string): string {
    // Strip all non-digits
    let digits = input.replace(/\D/g, '');
    
    // If it starts with 380, we keep it as is. 
    // If it starts with 0, we prepend 38.
    // If it starts with anything else, we assume it's the start of the 0... part
    if (digits.startsWith('380')) {
        // ok
    } else if (digits.startsWith('0')) {
        digits = '38' + digits;
    } else if (digits.length > 0) {
        digits = '380' + digits;
    }

    // Limit to 12 digits (38 + 0 + 9 digits)
    digits = digits.substring(0, 12);

    let result = '+38 (0';
    
    // We already have +38 (0 in the result. 
    // We need the next 9 digits from the input (excluding the leading 380)
    const rest = digits.startsWith('380') ? digits.substring(3) : '';
    
    if (rest.length > 0) {
        result += rest.substring(0, 2);
    }
    if (rest.length > 2) {
        result += ') ' + rest.substring(2, 5);
    }
    if (rest.length > 5) {
        result += '-' + rest.substring(5, 7);
    }
    if (rest.length > 7) {
        result += '-' + rest.substring(7, 9);
    }

    return digits.length > 0 ? result : '';
}
