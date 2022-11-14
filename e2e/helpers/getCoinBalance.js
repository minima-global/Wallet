const getByTestId = require('./getByTestId');

async function getCoinBalance(page) {
  await page.waitForSelector(getByTestId('SideMenu__link__Balance'), { visible: true });
  await page.click(getByTestId('SideMenu__link__Balance'));
  await page.click(getByTestId('Wallet__token__Minima'));
  const el = await page.$(getByTestId('CustomListItem__value__Coins'));
  const value = await page.evaluate(el => el.textContent, el);
  return Number(value);
}

module.exports = getCoinBalance;
