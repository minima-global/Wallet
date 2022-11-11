const getByTestId = require('./getByTestId');
const waitForSendableCoins = require('./waitForSendableCoins');
const acceptBurn = require('./acceptBurn');
const acceptConfirmation = require('./acceptConfirmation');
const acceptSuccess = require('./acceptSuccess');

async function waitForSendableToken(page, { tokenName, amount = 1, description = 'Test token' }) {
  let tries = 1;
  let maxAttempts = 30;

  await page.click(getByTestId('SideMenu__link__Balance'));
  await page.click(getByTestId('TokenListItem__token__Minima'));

  return new Promise((resolve) => {
    const interval = setInterval(async (reject) => {
      if (tries >= maxAttempts) {
        return reject('Timed out');
      }

      await page.reload();
      const el = await page.$(getByTestId('CustomListItem__value__Coins'));
      const value = await page.evaluate(el => el.textContent, el);

      if (Number(value) === expectedCoinBalance) {
        clearInterval(interval);
        resolve();
      } else {
        tries += 1;
      }
    }, 3000);
  });
}

module.exports = waitForSendableToken;
