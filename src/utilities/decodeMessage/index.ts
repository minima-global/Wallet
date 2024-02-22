export const decodeMessage = (encodedMessage: string) => {
    console.log(encodedMessage)    
    return decodeURIComponent(encodedMessage);
};

export default decodeMessage;
