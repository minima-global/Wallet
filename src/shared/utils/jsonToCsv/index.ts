import { format } from 'date-fns';

const downloadCsv = (transaction: any) => {
    const { headers, transactionCsv, fileName } = exportToCsv(transaction);
    downloadFile([...headers, transactionCsv].join('\n'), fileName);
};

const downloadAllAsCsv = (transaction: any) => {
    const { headers, transactionCsv, fileName } = exportToCsv(transaction);

    downloadFile([...headers, ...transactionCsv].join('\n'), fileName);
};

const exportToCsv = (transaction: any) => {
    let headers = ['Amount,Txpowid,SentToMx,SentTo0x,Date,Type,Block,Burn,Json'];

    let transactionCsv = '';
    if (!Array.isArray(transaction)) {
        transactionCsv = Object.values(transaction).toString();
    }
    if (Array.isArray(transaction)) {
        transactionCsv = transaction.reduce((acc: any, transaction: any) => {
            const { amount, txpowid, sentToMx, sentTo0x, date, type, blockPosted, burn, fullJson } = transaction;

            acc.push([amount, txpowid, sentToMx, sentTo0x, date, type, blockPosted, burn, fullJson].join(','));
            return acc;
        }, []);
    }

    const dateCreation = format(new Date(), '_dMMMyyyy_Hmm');
    const fileName = `transaction_export_${dateCreation}.csv`;

    return {
        headers,
        transactionCsv,
        fileName,
    };
};

const downloadFile = async (data: string, fileName: string) => {
    return new Promise(() => {
        // first we need to save this as a file
        (window as any).MDS.file.save(`/myTransactions/${fileName}`, data, function (resp: any) {
            if (resp.status) {
                // now that we have it let's make it downloadable.
                if (window.navigator.userAgent.includes('Minima Browser')) {
                    // @ts-ignore
                    return Android.fileDownload(MDS.minidappuid, `/myTransactions/${fileName}`);
                }

                const blob = new Blob([data], { type: 'text/csv' });

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
            }
        });
    });
};

export { downloadCsv, downloadAllAsCsv };
