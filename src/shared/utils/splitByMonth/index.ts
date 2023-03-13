import * as types from '../../../types/minima';
export const splitByMonth = (txpows: types.TxPOW[]): Map<string, types.TxPOW[]>[] => {
    const months = [
        { month: 'January', reg: 'Jan' },
        { month: 'February', reg: 'Feb' },
        { month: 'March', reg: 'Mar' },
        { month: 'April', reg: 'Apr' },
        { month: 'May', reg: 'May' },
        { month: 'June', reg: 'Jun' },
        { month: 'July', reg: 'Jul' },
        { month: 'August', reg: 'Aug' },
        { month: 'September', reg: 'Sep' },
        { month: 'October', reg: 'Oct' },
        { month: 'November', reg: 'Nov' },
        { month: 'December', reg: 'Dec' },
    ];

    // console.log('splitting array...', txpows);

    const splitByMonths = new Array();
    for (const i in months) {
        const map = new Map();
        const testRegexp = new RegExp(`(.*) ${months[i].reg} (.*)`);

        splitByMonths.push(
            map.set(
                months[i].month,
                txpows.filter((r) => testRegexp.test(r.header.date))
            )
        );
    }
    // console.log('splitbymonths', splitByMonths);
    return splitByMonths;
};

export default splitByMonth;
