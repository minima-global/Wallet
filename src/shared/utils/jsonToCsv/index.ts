const exportToCsv = (e: any, transaction: any) => {
    e.preventDefault();

    // Headers for each column
    let headers = ['Id,Amount,Tokenid,Address,Date,Type,Block,Burn'];

    // Convert users transaction data to a csv
    let usersCsv = transaction.reduce((acc: any, transaction: any) => {
        const { id, amount, tokenid, address, date, type, block, burn } = transaction;
        acc.push([id, amount, tokenid, address, date, type, block, burn].join(','));
        return acc;
    }, []);

    downloadFile({
        data: [...headers, ...usersCsv].join('\n'),
        fileName: `transaction-${new Date().getTime()}.csv`,
        fileType: 'text/csv',
    });
};
interface IProps {
    data: any;
    fileName: any;
    fileType: any;
}
const downloadFile = ({ data, fileName, fileType }: IProps) => {
    const blob = new Blob([data], { type: fileType });

    const a = document.createElement('a');
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
};

export default exportToCsv;
