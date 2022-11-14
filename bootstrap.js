const axios = require('axios');
const fs = require('fs');
const https = require('https');
const jsdom = require('jsdom');
const path = require('path');
const config = require('./e2e.config.json');

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

let appName = '';
let tries = 0;
let command = '';

function getAppName() {
    const app = fs.readFileSync(__dirname + '/public/dapp.conf', 'utf-8');
    return JSON.parse(app).name;
}

async function checkMinimaHasLoaded(port, additionalNode){
    try {
        const balance = await axios.get(`http://localhost:${port}/balance`);

        if (!config.testOnGenesis || additionalNode) {
            return balance.data.response.find(token => token.tokenid === '0x00');
        }

        return balance.data.response.find(token => token.tokenid === '0x00' && token.sendable !== '0');
    } catch {
        console.log(`Are you sure Minima is running on port: ${port}`);
        return false;
    }
}

async function getMdsPassword(port){
    const balance = await axios.get(`http://localhost:${port}/mds`);
    return balance.data.response.password;
}

async function checkIfAppIsInstalled(port){
    const mds = await axios.get(`http://localhost:${port}/mds`);
    return mds.data.response.minidapps.find(app => app.conf.name === appName);
}

async function removePreviousApps(port){
    const mds = await axios.get(`http://localhost:${port}/mds`);
    const apps = mds.data.response.minidapps.filter(app => app.conf.name === appName);
    for (app of apps) {
        await axios.get(`http://localhost:${port}/mds action:uninstall uid:${app.uid}`);
    }
}

async function getAppUid(port){
    const app = await checkIfAppIsInstalled(port);
    return app ? app.uid : null;
}

async function getMiniDAppPageUrl(port, password, uid) {
    return axios({
        url: `https://localhost:${port}/login.html`,
        method: 'post',
        data: `password=${password}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        httpsAgent,
    }).then(function (response) {
        let sessionId = '';
        let href = '';

        const document = new jsdom.JSDOM(response.data);
        const anchors = document.window.document.querySelectorAll('a');

        anchors.forEach(function(anchor) {
            if (anchor.href.includes(uid)) {
                href = anchor.href;
                sessionId = anchor.href.match(/(?<==).*/)[0];
            }
        });

        return {
            uid,
            href,
            sessionId,
        };
    });
}

async function rpc(port, command) {
    return axios({
        method: 'GET',
        url: `http://localhost:${port}/${command}`,
    }).then((response) => {
        console.log(response.data);
        return response.data;
    });
}

const checkIfMinimaHasLoaded = async (port, additionalNode = false) => {
    return new Promise((resolve) => {
        const check = () => {
            checkMinimaHasLoaded(port, additionalNode).then(function (hasLoaded) {
                if (tries > 20) {
                    clearInterval(interval);
                    console.log('Minima checks has timed out');
                    process.exit(1);
                }

                if (hasLoaded) {
                    console.log('Minima has loaded');
                    clearInterval(interval);
                    resolve();
                } else {
                    console.log('Minima is still loading...');
                    tries = tries + 1;
                }
            });
        };

        const interval = setInterval(check, 10000);
        check();
    });
};

const getMostRecentFile = (dir) => {
    if (!fs.existsSync(dir)) {
        return null;
    }

    const files = orderRecentFiles(dir);
    return files.length ? files[0] : undefined;
};

const orderRecentFiles = (dir) => {
    return fs.readdirSync(dir)
      .filter((file) => file !== '.DS_Store')
      .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
      .map((file) => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime, fullPath: `${dir}/${file}` }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
};

const bootstrap = async (rpcPort, splitCoins = false) => {
    appName = await getAppName();
    const mdsPort = rpcPort - 2;
    const recentFile = getMostRecentFile(__dirname + (config.pathToMiniDAppBuildFolder || '/minidapp'));

    if (recentFile) {
        if (process.env.CI) {
            command = `mds action:install file:/workspace/minidapp/${recentFile.file} trust:write`;
        } else {
            await removePreviousApps(rpcPort);
            command = `mds action:install file:${recentFile.fullPath} trust:write`;
        }

        await rpc(rpcPort, command);
    }

    // split coins, will make tests run faster
    if (splitCoins) {
        const address = await rpc(rpcPort, 'getaddress');
        const balance = await rpc(rpcPort, 'balance');
        const minimaCoin = balance.response.find(t => t.tokenid === '0x00');

        if (minimaCoin.coins === '1') {
            await rpc(rpcPort, `send amount:10 address:${address.response.miniaddress} tokenid:0x00 split:4`);
        } else {
            console.log('Skipping splitting coins');
        }
    }

    const appUid = await getAppUid(rpcPort);
    const mdsPassword = await getMdsPassword(rpcPort);
    const app = await getMiniDAppPageUrl(mdsPort, mdsPassword, appUid);

    return {
        rpcUrl: `http://localhost:${rpcPort}`,
        mdsUrl: `https://localhost:${mdsPort}`,
        rpcPort,
        mdsPort,
        miniDAppUid: app.uid,
        miniDAppUrl: app.href.replace('./', `https://localhost:${mdsPort}/`),
    };
};

(async () => {
    appName = getAppName();

    await Promise.all([
        checkIfMinimaHasLoaded(config.clientOnePort || 9005),
        config.enabledSecondClient ? checkIfMinimaHasLoaded(config.clientTwoPort || 8005, true) : false,
    ].filter(Boolean));

    const response = await Promise.all([
        bootstrap(9005, true),
        config.enabledSecondClient ? bootstrap(config.clientTwoPort || 8005, false) : false,
    ].filter(Boolean));

    const session = {
        MINIDAPP_UID: response[0].miniDAppUid,
        MINIDAPP_APP_URL: response[0].miniDAppUrl,
        MINIMA_RPC_URL: response[0].rpcUrl,
    };

    if (config.enabledSecondClient) {
        session['SECOND_MINIDAPP_UID'] = response[1].miniDAppUid;
        session['SECOND_MINIDAPP_APP_URL'] = response[1].miniDAppUrl;
        session['SECOND_MINIMA_RPC_URL'] = response[1].rpcUrl;
    }

    console.log(session);

    fs.writeFileSync('./session.json', JSON.stringify(session, null, 2));

    process.exit();
})();
