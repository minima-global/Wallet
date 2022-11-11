const getByTestId = require('./getByTestId');

async function waitForToken(page, tokenName) {
  await page.bringToFront();
  await page.click(getByTestId('SideMenu__link__Balance'));
  await page.waitForSelector(getByTestId(`TokenListItem__token__${tokenName}`), { visible: true, timeout: 180000 });
  await page.click(getByTestId(`TokenListItem__token__${tokenName}`));
}

module.exports = waitForToken;
