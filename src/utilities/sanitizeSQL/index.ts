export function sanitizeSQLInput(input: string) {
    // Define a regular expression pattern to match potentially harmful characters
    const pattern = /['";\\]/g;
    // Replace potentially harmful characters with an empty string
    const sanitizedInput = input.replace(pattern, '');
    return sanitizedInput;
}

export default sanitizeSQLInput