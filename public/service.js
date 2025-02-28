var TIMER_COUNT = 0;

var getHistoryAndStore = function () {
    MDS.cmd('history', function (response) {
        MDS.sql(`SELECT * FROM txpows WHERE txpowid IN ('${response.response.txpows.map((txpow) => txpow.txpowid).join("','")}')`, function (result) {
            const txpowsInDatabase = result.rows.map((row) => row.TXPOWID);
            const txpowsNotInDatabase = [];

            response.response.txpows.forEach((txpow, index) => {
                const details = response.response.details[index];

                if (!txpowsInDatabase.includes(txpow.txpowid)) {
                    txpowsNotInDatabase.push(`INSERT INTO txpows (txpowid, timemilli, isblock, istransaction, hasbody, burn, superblock, size, header, body, details) VALUES ('${txpow.txpowid}', ${txpow.header.timemilli}, ${txpow.isblock}, ${txpow.istransaction}, ${txpow.hasbody}, ${txpow.burn}, ${txpow.superblock}, ${txpow.size}, '${JSON.stringify(txpow.header)}', '${JSON.stringify(txpow.body).replace(/'/g, "''")}','${JSON.stringify(details)}')`);
                }
            });
            

            try {
                const chunked = [];
                
                txpowsNotInDatabase.forEach(function (_, i) {
                    if (i % 10 === 0) {
                        chunked.push(txpowsNotInDatabase.slice(i, i + 10));
                    }
                });
    
                chunked.forEach(function (element) { 
                    MDS.sql(element.join('; '), function () {
                        // do nothing on success
                    });
                });
            } catch (error) {
                // silently ignore
            }
        })
    });
}

MDS.init(function (msg) {
    if (msg.event === 'inited') {
        MDS.sql('CREATE TABLE IF NOT EXISTS txpows (txpowid TEXT PRIMARY KEY, timemilli BIGINT, isblock BOOLEAN, istransaction BOOLEAN, hasbody BOOLEAN, burn INT, superblock INT, size INT, header TEXT, body TEXT, details TEXT)', function () {
            getHistoryAndStore();
        });
    }

    if (msg.event === 'MDS_TIMER_10SECONDS') {
        TIMER_COUNT++;

        if (TIMER_COUNT >= 2) {
            getHistoryAndStore();
            TIMER_COUNT = 0;
        }
    }
})