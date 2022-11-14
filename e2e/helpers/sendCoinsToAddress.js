const getByTestId = require('./getByTestId');

async function sendCoinsToAddress(page, address, amount, burn = false) {
  await page.click(getByTestId('SideMenu__link__Send'));
  await page.type(`${getByTestId('ValueTransfer__address', { input: true })}`, address);
  await page.type(`${getByTestId('ValueTransfer__amount', { input: true })}`, String(amount));

  if (burn) {
    await page.type(`${getByTestId('ValueTransfer__burn', { input: true })}`, String(burn));
  }

  await page.click(getByTestId('ValueTransfer__next'));
}

module.exports = sendCoinsToAddress;
