const getByTestId = require('./getByTestId');

async function sendCoinsToAddress(page, address, amount) {
  await page.click(getByTestId('SideMenu__link__Send'));
  await page.type(`${getByTestId('Send__address')} input`, address);
  await page.type(`${getByTestId('Send__amount')} input`, String(amount));
  await page.click(getByTestId('Send__next'));
}

module.exports = sendCoinsToAddress;
