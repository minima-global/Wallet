var TIMER_COUNT = 0;

var getHistoryAndStore = function () {
    MDS.cmd('history', function (response) {
        MDS.sql(`SELECT * FROM txpows WHERE txpowid IN ('${response.response.txpows.map((txpow) => txpow.txpowid).join("','")}')`, function (result) {
            const txpowsInDatabase = result.rows.map((row) => row.TXPOWID);
            const txpowsNotInDatabase = [];

            for (let index = 0; index < response.response.txpows.length; index++) {
                const txpow = response.response.txpows[index];
                const details = response.response.details[index];

                if (!txpowsInDatabase.includes(txpow.txpowid)) {
                    txpowsNotInDatabase.push(`INSERT INTO txpows (txpowid, timemilli, isblock, istransaction, hasbody, burn, superblock, size, header, body, details) VALUES ('${txpow.txpowid}', ${txpow.header.timemilli}, ${txpow.isblock}, ${txpow.istransaction}, ${txpow.hasbody}, ${txpow.burn}, ${txpow.superblock}, ${txpow.size}, '${JSON.stringify(txpow.header)}', '${JSON.stringify(txpow.body)}','${JSON.stringify(details)}')`);
                }
            }

            MDS.sql(txpowsNotInDatabase.join('; '), function () {
                // completed
            });
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