const getByTestId = require('./getByTestId');
const pause = require('./pause');

async function setTokenAsSwap(page, tokenName) {
  await page.click(getByTestId('SideMenu__link__Send'));
  await page.waitForSelector(getByTestId('TokenListItem__token__Minima'));
  await page.click(getByTestId('TokenListItem__token__Minima'));
  await pause(2500);
  await page.waitForSelector(getByTestId(`TokenListItem__token__${tokenName}`));
  await page.click(getByTestId(`TokenListItem__token__${tokenName}`));
  await page.waitForSelector(getByTestId(`TokenListItem__token__${tokenName}`));
}

module.exports = setTokenAsSwap;
