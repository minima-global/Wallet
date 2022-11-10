import { INSUFFICIENT } from './../minima/constants';

/** Copy to clipboard */
export async function copyTextToClipboard(text: string) {
    if ('clipboard' in navigator) {
        // console.log('using clipboard');
        return await navigator.clipboard.writeText(text);
    } else {
        // console.log('using document.execCommand');
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
    if (typeof str1 === 'string') {
        var hex = str1.toString();
        console.log(hex);
        var str = '';
        for (var n = 0; n < hex.length; n += 2) {
            str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
        }
        return str;
    } else {
        console.error(`Can't call hexToString on non-string type.`);
    }
};

// string to hex
export const strToHex = (str: string) => {
    console.log(str);
    var hex = '';
    for (var i = 0; i < str.length; i++) {
        hex += '' + str.charCodeAt(i).toString(16);
    }
    return hex;
};

// contains text filter
export const containsText = (text: string, searchText: string) =>
    text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

// is it a string
export const isPropertyString = (prop: any) => (typeof prop === 'string' ? true : false);

// does user have funds to spend?
export const checkFunds = (balance: any[], tokenid: string, amount: number) => {
    const tkn = balance.find((v) => v.tokenid === tokenid);
    return parseInt(tkn.sendable) > amount;
};

// is it defined
const isDefined = (testObj: any) => (typeof testObj !== 'undefined' ? true : false);

// test against insufficient fund error
export const insufficientFundsError = (msg: string) => {
    if (isDefined(msg) && containsText(msg, INSUFFICIENT)) {
        return true;
    }

    return false;
};

export const isValidURLAll = (urlString: string) => {
    try {
        new URL(urlString);
        return true;
    } catch (err) {
        console.error(err)
        return false;
    }
};

export const isValidURLSecureOnly = (urlString: string) => {
    try {
        const url = new URL(urlString)
        console.log(url)
        return url.protocol === 'https:';
    } catch(err) {
        console.error(err)
        return false;
    }
}

export const numberWithCommas = (x: string) => {
    try {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    } catch (err) {
      console.error(err)
      return x;
  
    }
}
/**
 * 
 * @param imageData tokens image uri
 * @param tokenid tokens id for reference
 */
export const makeTokenImage = (imageData: string, tokenid: string): string | undefined => {
    let imageUrl = undefined;
    try {
        var parser = new DOMParser();
        const doc = parser.parseFromString(imageData, 'application/xml');
        const errorNode = doc.querySelector('parsererror');
        if (errorNode) {
            console.error('Token does not contain an image', tokenid);
        } else {
            var imageString = doc.getElementsByTagName('artimage')[0].innerHTML;
            imageUrl = `data:image/jpeg;base64,${imageString}`;
        }
        
        return imageUrl;
    } catch(err) {
        console.error(`Failed to create image data ${tokenid}`, err);
    }
    
    return undefined;
}
