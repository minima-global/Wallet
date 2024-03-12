import { DetailsTxPOW } from '../../../types/minima';

export const getTxPOWDetailsType = (detail: DetailsTxPOW) => {
    try {
        
        const sizeOfJavascriptObject = Object.keys(detail.difference);
    
        if (sizeOfJavascriptObject.length === 1) {
            return 'normal';
        }
        if (sizeOfJavascriptObject.length > 1) {
            const isTokenCreate = Object.keys(detail.difference)[1] === '0xFF';
            if (isTokenCreate) {
                return 'tokencreate';
            }
        }
        return 'custom';
    } catch (error) {
        return '';
    }
};

export default getTxPOWDetailsType;
