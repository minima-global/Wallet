const getByTestId = require('./getByTestId');

async function acceptBurn(page, burn = undefined) {
  await page.waitForSelector(getByTestId('Burn_next'));

  // fill out burn amount if value is valid
  if (typeof burn === 'number') {
      await page.type(`${getByTestId('Burn_burn')} input`, String(burn));
  }

  await page.click(getByTestId('Burn_next'));
}

module.exports = acceptBurn;
