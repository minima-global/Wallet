import formatNumber from 'format-number';

export const formatNumberPreference = (
    number: any,
    truncate: number,
    suffix: string,
    format: { decimal: '.'; thousands: ',' }
) => {
    return formatNumber({
        truncate,
        suffix,
        decimal: format.decimal,
        integerSeparator: format.thousands,
    })(number);
};

export default formatNumberPreference;
