const path = require("path");
const getByTestId = require('./getByTestId');
const waitForSendableCoins = require('./waitForSendableCoins');
const acceptBurn = require('./acceptBurn');
const acceptConfirmation = require('./acceptConfirmation');
const acceptSuccess = require('./acceptSuccess');

async function waitForCreateNFT(page, { nftName, amount = 1 }) {
  // need a send-able minima coin to create a token
  await waitForSendableCoins(page);

  // go to NFT page
  await page.click(getByTestId('SideMenu__link__NFTs'));
  await page.click(getByTestId('NFTs__createNft'));

  // select image
  const fileInput = await page.$(getByTestId('input-image'));
  await fileInput.uploadFile(path.join(__dirname, "../resources/minima.png"));

  // fill out form fields
  await page.type(`${getByTestId('CreateNFTForm__name')} input`, nftName);
  await page.type(`${getByTestId('CreateNFTForm__amount')} input`, String(amount));
  await page.click(getByTestId('CreateNFTForm__mint'));

  await acceptConfirmation(page);
}

module.exports = waitForCreateNFT;
