const getByTestId = require('./getByTestId');
const pause = require('./pause');

async function setTokenAsSwap(page, tokenName) {
  await page.click(getByTestId('SideMenu__link__Send'));
  await page.waitForSelector(getByTestId('MiSelect__container'));
  await page.click(getByTestId('MiSelect__container'));
  await page.waitForSelector(getByTestId(`MiSelect__option__${tokenName}`));
  await pause(1000);
  await page.click(getByTestId(`MiSelect__option__${tokenName}`));
}

module.exports = setTokenAsSwap;
