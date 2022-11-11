const getByTestId = require('./getByTestId');
const waitForSendableCoins = require('./waitForSendableCoins');
const acceptBurn = require('./acceptBurn');
const acceptConfirmation = require('./acceptConfirmation');
const acceptSuccess = require('./acceptSuccess');
const path = require("path");

async function waitForCreateToken(page, { tokenName, amount = 1, description = 'Test token' }) {
    // need a send-able minima coin to create a token
    await waitForSendableCoins(page);

    await page.click(getByTestId('SideMenu__link__Create Token'));

    // select image
    const fileInput = await page.$(getByTestId('input-image'));
    await fileInput.uploadFile(path.join(__dirname, "../resources/minima.png"));

    // await page.type(`${getByTestId('TokenCreate_url')} input`, 'https://blog.hootsuite.com/wp-content/uploads/2021/07/free-stock-photos-12.jpeg');

    await page.type(`${getByTestId('TokenCreate_name')} input`, tokenName);
    await page.type(`${getByTestId('TokenCreate_amount')} input`, String(amount));
    await page.type(`${getByTestId('TokenCreate_description')} textarea`, description);
    await page.click(getByTestId('TokenCreate_create'));

    await acceptConfirmation(page);
    await acceptSuccess(page);
}

module.exports = waitForCreateToken;
