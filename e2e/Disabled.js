// it('allows the ability to split a Minima coin with a burn', async () => {
//   await helpers.waitForSendableCoins(page);
//   await page.click(helpers.getByTestId('SideMenu__link__Balance'));
//   await page.click(helpers.getByTestId('TokenListItem__token__Minima'));
//
//   // get the current coin amount
//   const currentNumberOfCoins = helpers.getCoinBalance(page);
//
//   // split minima coin
//   await page.click(helpers.getByTestId('SideMenu__link__Send'));
//   await page.waitForSelector(helpers.getByTestId('Send__method'));
//   await page.click(helpers.getByTestId('Send__method'));
//   await page.waitForSelector(helpers.getByTestId('Send__method__2'));
//   await page.click(helpers.getByTestId('Send__method__2'));
//   await new Promise((r) => setTimeout(r, 500));
//   await page.click(helpers.getByTestId('Send__next'));
//
//   await helpers.acceptBurn(page, 1);
//   await helpers.acceptConfirmation(page);
//
//   // wait for minima coins to be split (this could take a while)
//   await page.click(helpers.getByTestId('SideMenu__link__Balance'));
//   await page.click(helpers.getByTestId('TokenListItem__token__Minima'));
//
//   console.log(`current number of coins before split: ${currentNumberOfCoins}`);
//
//   if (currentNumberOfCoins >= 20) {
//     throw new Error('Could not run test as current number of coins is already at max, please consolidate coins and re-run');
//   }
//
//   await page.waitForFunction((dataTestId, currentNumberOfCoins) => {
//     return document.querySelector(dataTestId).textContent !== currentNumberOfCoins;
//   }, {}, helpers.getByTestId('CustomListItem__value__Coins'), currentNumberOfCoins);
//
//   await page.screenshot({ path: '../screenshots/split_minima_coins_with_burn.png' });
// });
