const getByTestId = require('./getByTestId');

async function getWalletAddress(page) {
  await page.click(getByTestId('SideMenu__link__Receive'));
  const el = await page.$(getByTestId('CustomListItem__value__Wallet Address'));
  const value = await page.evaluate(el => el.textContent, el);
  return value;
}

module.exports = getWalletAddress;
