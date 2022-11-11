const session = require("../session.json");
const helpers = require("./helpers");
const { faker } = require("@faker-js/faker");

describe('Wallet (Transactional) - End to End', () => {
  let secondPage;

  beforeAll(async () => {
    secondPage = await browser.newPage();
    await page.goto(session.MINIDAPP_APP_URL);
    await helpers.waitForSendableCoins(page);
    await helpers.setAppPermission(session.MINIMA_RPC_URL, session.MINIDAPP_UID, 'write');
  });

  beforeEach(async () => {
    await page.goto(session.MINIDAPP_APP_URL);
    await secondPage.goto(session.SECOND_MINIDAPP_APP_URL);
    await page.bringToFront();
  });

  afterAll(async () => {
    await helpers.setAppPermission(session.MINIMA_RPC_URL, session.MINIDAPP_UID, 'write');
  });

  it('allows the user to send a minima coin to another user', async () => {
    const receiver = await helpers.getWalletAddress(secondPage);
    const balance = await helpers.getCoinBalance(secondPage);

    const amountToSend = 1;
    const expectedCoinBalance = balance + amountToSend;

    await helpers.waitForSendableCoins(page);
    await helpers.sendCoinsToAddress(page, receiver, amountToSend);
    await helpers.acceptBurn(page);
    await helpers.acceptConfirmation(page);
    await helpers.acceptSuccess(page);

    await secondPage.bringToFront();
    await helpers.waitForCoinBalance(secondPage, expectedCoinBalance);
    const updatedBalance = await helpers.getCoinBalance(secondPage);
    await secondPage.screenshot({ path: '../screenshots/send_minima_coins_to_another_user.png' });

    expect(updatedBalance).toEqual(expectedCoinBalance);
  });

  it('allows the user to send a token to another user', async () => {
    const receiver = await helpers.getWalletAddress(secondPage);

    const tokenName = 'TOKEN__' + faker.word.adjective() + '__' + faker.word.adjective();

    await helpers.waitForCreateToken(page, { tokenName });
    await helpers.waitForSendableCoins(page, tokenName);
    await helpers.setTokenAsSwap(page, tokenName);
    await helpers.sendCoinsToAddress(page, receiver, 1);
    await helpers.acceptBurn(page);
    await helpers.acceptConfirmation(page);
    await helpers.acceptSuccess(page);

    await secondPage.bringToFront();
    await helpers.waitForToken(secondPage, tokenName);
    await secondPage.screenshot({ path: '../screenshots/send_token_to_another_user.png' });
  });

  it('allows the user to send a token to another user with a burn', async () => {
    const receiver = await helpers.getWalletAddress(secondPage);

    const tokenName = 'TOKEN__' + faker.word.adjective() + '__' + faker.word.adjective();

    await helpers.waitForCreateToken(page, { tokenName });
    await helpers.waitForSendableCoins(page, tokenName);
    await helpers.setTokenAsSwap(page, tokenName);
    await helpers.sendCoinsToAddress(page, receiver, 1);
    await helpers.acceptBurn(page, 1);
    await helpers.acceptConfirmation(page);
    await helpers.acceptSuccess(page);

    await secondPage.bringToFront();
    await helpers.waitForToken(secondPage, tokenName);
    await secondPage.screenshot({ path: '../screenshots/send_token_to_another_user.png' });
  });

  it('allows the user to transfer a nft to another user', async () => {
    const nftName = 'NFT__' + faker.word.adjective() + '__' + faker.word.adjective();
    const receiver = await helpers.getWalletAddress(secondPage);

    // create nft
    await helpers.waitForSendableCoins(page);
    await helpers.waitForCreateNFT(page, { nftName });
    await helpers.waitForSendableCoins(page, nftName);

    // sent nft to the other user
    await helpers.setTokenAsSwap(page, nftName);
    await helpers.sendCoinsToAddress(page, receiver, 1);
    await helpers.acceptBurn(page);
    await helpers.acceptConfirmation(page);
    await helpers.acceptSuccess(page);

    // wait for nft to appear on the balance page
    await secondPage.bringToFront();
    await secondPage.click(helpers.getByTestId('SideMenu__link__Balance'));
    await secondPage.waitForSelector(helpers.getByTestId(`Wallet__token__${nftName}`), { timeout: 360000 });

    await secondPage.screenshot({ path: '../screenshots/transfer_nft_to_another_user.png' });
  });

  it('allows the user to transfer a nft if the user has the wallet installed as a read app', async () => {
    await helpers.setAppPermission(session.MINIMA_RPC_URL, session.MINIDAPP_UID, 'read');
    await helpers.pause(500);

    const nftName = 'NFT__' + faker.word.adjective() + '__' + faker.word.adjective();
    const receiver = await helpers.getWalletAddress(secondPage);

    await helpers.waitForSendableCoins(page);
    await helpers.waitForCreateNFT(page, { nftName });

    // accept action to create nft
    await helpers.pause(1000);
    await helpers.acceptPermissionRequest(session.MINIMA_RPC_URL, session.MINIDAPP_UID);

    // wait for the nft to become sendable
    await helpers.waitForSendableCoins(page, nftName);
    await helpers.setTokenAsSwap(page, nftName);
    await helpers.sendCoinsToAddress(page, receiver, 1);
    await helpers.acceptBurn(page);
    await helpers.acceptConfirmation(page);
    await helpers.acceptSuccess(page);

    // accept action to send nft
    await helpers.pause();
    await helpers.acceptPermissionRequest(session.MINIMA_RPC_URL, session.MINIDAPP_UID);
    await helpers.pause();

    // wait for nft to appear on the balance page
    await secondPage.bringToFront();
    await secondPage.click(helpers.getByTestId('SideMenu__link__Balance'));
    await secondPage.waitForSelector(helpers.getByTestId(`Wallet__token__${nftName}`), { timeout: 360000 });

    await secondPage.screenshot({ path: '../screenshots/transfer_nft_to_another_user_in_read_mode.png' });
  });
});
