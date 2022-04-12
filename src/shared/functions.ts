/** Copy to clipboard */

export async function copyTextToClipboard(text: string) {
    if ('clipboard' in navigator) {
        console.log('using clipboard');
        return await navigator.clipboard.writeText(text);
    } else {
        console.log('using document.execCommand');
        return copy(text);
    }
}

// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript/33928558#33928558
export function copy(text: string) {
    var input = document.createElement('textarea');
    input.innerHTML = text;
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
    return Promise.resolve(result);
}
