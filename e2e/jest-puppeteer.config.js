require('dotenv').config({ path: '../.env' });

module.exports = {
    launch: {
        devtools: false,
        headless: process.env.HEADLESS === '1',
        ignoreHTTPSErrors: true,
        defaultViewport: null,
        args: [
            '--ignore-certificate-errors',
            '--disable-web-security',
            '--use-gl=swiftshader'
        ]
    },
}
