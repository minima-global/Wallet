const { zipSync } = require('windows-zip');

const path = ['./build'];

const dest = './minidapp/wallet-$npm_package_version.mds.zip';

zipSync(path, dest);
