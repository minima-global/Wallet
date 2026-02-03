export function isValidHttpUrl(str: string) {
    if (typeof str !== 'string' || !str.trim()) return false;

    // must start with http(s)://
    if (!/^https?:\/\/.+/i.test(str)) return false;

    try {
        const url = new URL(str);
        if (!url.hostname) return false;
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}
