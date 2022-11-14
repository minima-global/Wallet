const session = require("../session.json");
const helpers = require("./helpers");
const { faker } = require("@faker-js/faker");

describe('Wallet - End to End', () => {
  beforeEach(async () => {
    await page.goto(session.MINIDAPP_APP_URL);
    await page.bringToFront();
  });

  it('should be titled "Wallet"', async () => {
    await expect(page.title()).resolves.toMatch('Wallet');
  });

  it('displays the Minima token on the balance page', async () => {
    expect(await page.$(helpers.getByTestId('Wallet__token__Minima'))).toBeTruthy();
  });

  it('displays the wallet address on the receive page', async () => {
    await page.click(helpers.getByTestId('SideMenu__link__Receive'));
    const el = await page.$(helpers.getByTestId('CustomListItem__value__Wallet Address'));
    const value = await page.evaluate(el => el.textContent, el);
    await page.screenshot({ path: '../screenshots/wallet_address_on_receive_page.png' });
    expect(value).toMatch(/Mx.+/g);
  });

  it('allows the user to create a token', async () => {
    const tokenName = 'TOKEN__' + faker.word.adjective() + '__' + faker.word.adjective();

    await helpers.waitForSendableCoins(page);
    await helpers.waitForCreateToken(page, { tokenName });

    // wait for token id to appear on the balance page
    await page.click(helpers.getByTestId('SideMenu__link__Balance'));
    await page.waitForSelector(helpers.getByTestId(`Wallet__token__${tokenName}`), { timeout: 360000 });

    await page.screenshot({ path: '../screenshots/create_token.png' });
  });

  it('allows the user to create a nft', async () => {
    const nftName = 'NFT__' + faker.word.adjective() + '__' + faker.word.adjective();

    await helpers.waitForSendableCoins(page);
    await helpers.waitForCreateNFT(page, { nftName });

    // wait for nft to appear on the balance page
    await page.click(helpers.getByTestId('SideMenu__link__Balance'));
    await page.waitForSelector(helpers.getByTestId(`Wallet__token__${nftName}`), { timeout: 360000 });

    await page.screenshot({ path: '../screenshots/create_nft.png' });
  });

  it('allows the user to favourite and un-favourite a nft', async () => {
    const nftName = 'NFT__' + faker.word.adjective() + '__' + faker.word.adjective();

    await helpers.waitForSendableCoins(page);
    await helpers.waitForCreateNFT(page, { nftName });

    // go to NFT page
    await page.click(helpers.getByTestId('SideMenu__link__NFTs'));

    // Favourite the NFT
    await page.waitForSelector(`${helpers.getByTestId('NFTCard__card'  + '__' + nftName)}`, { timeout: 180000 });
    await page.hover(`${helpers.getByTestId('NFTCard__card'  + '__' + nftName)}`);
    await page.click(`${helpers.getByTestId('NFTCard__favourite'  + '__' + nftName)}`);

    // Check if NFT is on the favourites page
    await page.click(helpers.getByTestId('NFTs__favouriteTab'));
    await page.waitForSelector(`${helpers.getByTestId('NFTCard__card'  + '__' + nftName)}`, { timeout: 180000 });

    await page.screenshot({ path: '../screenshots/can_favourite_nft.png' });

    // Go back to the previous page and un-favourite the NFT
    await page.click(helpers.getByTestId('NFTs__collectedTab'));
    await page.waitForSelector(`${helpers.getByTestId('NFTCard__card'  + '__' + nftName)}`);
    await page.hover(`${helpers.getByTestId('NFTCard__card'  + '__' + nftName)}`);
    await page.waitForSelector(`${helpers.getByTestId('NFTCard__unfavourite'  + '__' + nftName)}`);
    await page.click(`${helpers.getByTestId('NFTCard__unfavourite'  + '__' + nftName)}`);

    // Check the NFT page is no longer on the favourites page
    await page.click(helpers.getByTestId('NFTs__favouriteTab'));
    await page.waitForSelector(`${helpers.getByTestId('NFTCard__card'  + '__' + nftName)}`, { hidden: true });

    await page.screenshot({ path: '../screenshots/can_unfavourite_nft.png' });
  });

  it('shows valid tokens that are splittable or transferable', async () => {
    const tokenName = 'TOKEN__' + faker.word.adjective() + '__' + faker.word.adjective();

    await helpers.waitForSendableCoins(page);
    await helpers.waitForCreateToken(page, { tokenName });

    // open the select token dropdown
    await page.click(helpers.getByTestId('SideMenu__link__Send'));
    await page.click(helpers.getByTestId('MiSelect__container'));
    await page.waitForSelector(helpers.getByTestId(`MiSelect__optionDisabled__${tokenName}`), { timeout: 360000 });

    // the token should become send-able after X seconds
    await page.waitForSelector(helpers.getByTestId(`MiSelect__optionDisabled__${tokenName}`), { timeout: 360000, hidden: true });

    await page.screenshot({ path: '../screenshots/valid_tokens_as_sendable_or_transferable.png' });
  });

  it('allows the ability to split a Minima coin', async () => {
    await helpers.waitForSendableCoins(page);

    // get the current coin amount
    const currentNumberOfCoins = await helpers.getCoinBalance(page);

    // split minima coin
    await page.click(helpers.getByTestId('SideMenu__link__Send'));
    await page.click(helpers.getByTestId('Send__select'));
    await page.waitForSelector(helpers.getByTestId('Send__coinSplit'));
    await page.click(helpers.getByTestId('Send__coinSplit'));

    await new Promise((r) => setTimeout(r, 500));
    await page.click(helpers.getByTestId('CoinSplit__next'));

    await helpers.acceptConfirmation(page);
    await helpers.acceptSuccess(page);

    // wait for minima coins to be split (this could take a while)
    await page.click(helpers.getByTestId('SideMenu__link__Balance'));
    await page.waitForSelector(helpers.getByTestId('Wallet__token__Minima'));
    await page.click(helpers.getByTestId('Wallet__token__Minima'));

    console.log(`current number of coins before split: ${currentNumberOfCoins}`);

    if (currentNumberOfCoins >= 20) {
      throw new Error('Could not run test as current number of coins is already at max, please consolidate coins and re-run');
    }

    await page.waitForFunction((dataTestId, currentNumberOfCoins) => {
      return document.querySelector(dataTestId).textContent !== currentNumberOfCoins;
    }, {}, helpers.getByTestId('CustomListItem__value__Coins'), currentNumberOfCoins);

    await page.screenshot({ path: '../screenshots/split_minima_coins.png' });
  });
});
