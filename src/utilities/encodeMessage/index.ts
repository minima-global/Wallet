export const encodeMessage = (message: string) => {   
    return encodeURIComponent(message);
};

export default encodeMessage;
