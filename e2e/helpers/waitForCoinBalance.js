const getByTestId = require('./getByTestId');

async function waitForCoinBalance(page, expectedCoinBalance) {
  let tries = 1;
  let maxAttempts = 30;

  await page.click(getByTestId('SideMenu__link__Balance'));
  await page.click(getByTestId('Wallet__token__Minima'));

  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
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

module.exports = waitForCoinBalance;
