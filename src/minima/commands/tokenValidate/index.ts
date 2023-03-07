export const tokenValidate = (tokenid: string) => {
    return new Promise((resolve, reject) => {
        MDS.cmd(`tokenvalidate tokenid:${tokenid}`, (r) => {
            if (!r.status) reject(r.error ? r.error : 'RPC Failed');

            if (r.response.web.webvalidate) resolve(true);
        });
    });
};

export default tokenValidate;
