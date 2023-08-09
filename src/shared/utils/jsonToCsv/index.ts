import { Android } from '@mui/icons-material';
import { format } from 'date-fns';

const exportToCsv = (e: any, transaction: any) => {
    e.preventDefault();

    // Headers for each column
    let headers = ['Id,Amount,Tokenid,Address,Date,Type,Block,Burn,Json'];

    // Convert users transaction data to a csv
    let usersCsv = transaction.reduce((acc: any, transaction: any) => {
        const { id, amount, tokenid, address, date, type, block, burn, json } = transaction;
        acc.push([id, amount, 'id:' + tokenid, address, date, type, block, burn, json].join(','));
        return acc;
    }, []);

    const dateCreation = format(new Date(), '_dMMMyyyy_Hmm');
    const fileName = `transaction_export_${dateCreation}`;

    downloadFile([...headers, ...usersCsv].join('\n'), `${fileName}.csv`);
};
interface IProps {
    data: any;
    fileName: any;
    fileType: any;
}

const downloadFile = async (data: string, fileName: string) => {
    return new Promise((resolve) => {
        // first we need to save this as a file
        (window as any).MDS.file.save(`/myTransactions/${fileName}`, data, function (resp: any) {
            if (resp.status) {
                // now that we have it let's make it downloadable.
                if (window.navigator.userAgent.includes('Minima Browser')) {
                    // @ts-ignore
                    return Android.fileDownload(MDS.minidappuid, `/myTransactions/${fileName}`);
                }

                const origFilePath = `/myTransactions/${fileName}`;
                const newFilePath = `/my_downloads/${fileName}_minima_download_as_file_`;
                //Copy the original file to webfolder - WITH the special name
                (window as any).MDS.file.copytoweb(origFilePath, newFilePath, function () {
                    const url = `my_downloads/${fileName}` + '_minima_download_as_file_';
                    // Now create a normal link - that when clicked downloads it..
                    const link = document.createElement('a');
                    link.href = url;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    resolve(true);
                });
            }
        });
    });
};

export default exportToCsv;
