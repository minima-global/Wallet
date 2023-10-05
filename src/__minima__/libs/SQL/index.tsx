export function sql(query: string, singleResult = true) {
    return new Promise((resolve, reject) => {
        (window as any).MDS.sql(query, function (response: any) {
            if (response.status) {
                if (response.rows && singleResult) {
                    return resolve(response.rows[0]);
                } else if (response.rows) {
                    return resolve(response.rows);
                }

                return resolve(response.status);
            }

            return reject();
        });
    });
}
