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

// hex to string
export const hexToString = (str1: string) => {
    var hex = str1.toString();
    var str = "";
    for (var n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  };
  
  
  // string to hex
  export const strToHex = (str: string) => {
    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return hex;
  }

  // contains text filter
  export const containsText = (text: string, searchText: string) =>
    text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
  
  // is it a string
  export const isPropertyString = (prop: any) => 
    typeof prop === 'string' ? true : false