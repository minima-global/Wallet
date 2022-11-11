const getByTestId = require("./getByTestId");
const pause = require("./pause");

async function waitForSendableCoins(page, tokenName = 'Minima') {
  let tries = 1;
  let maxAttempts = 30;

  await page.click(getByTestId('SideMenu__link__Balance'));
  await page.evaluate(() => { window.scroll(0,0); });

  await page.waitForSelector(getByTestId(`Wallet__token__${tokenName}`), { visible: true, timeout: 360000 });
  await page.click(getByTestId(`Wallet__token__${tokenName}`));

  return new Promise((resolve, reject) => {
    const check = async () => {
      if (tries >= maxAttempts) {
        return reject('Timed out');
      }

      await page.reload();
      await page.waitForSelector(getByTestId('CustomListItem__value__Sendable'));
      const el = await page.$(getByTestId('CustomListItem__value__Sendable'));
      const value = await page.evaluate(el => el.textContent, el);
      if (Number(value) !== 0) {
        resolve();
        clearInterval(interval);
      } else {
        tries += 1;
      }
    };

    const interval = setInterval(check, 5000);
    check();
  });
}

module.exports = waitForSendableCoins;
