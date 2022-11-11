const getByTestId = require('./getByTestId');
const waitForSendableCoins = require('./waitForSendableCoins');
const getWalletAddress = require('./getWalletAddress');
const getCoinBalance = require('./getCoinBalance');
const sendCoinsToAddress = require('./sendCoinsToAddress');
const acceptBurn = require('./acceptBurn');
const acceptSuccess = require('./acceptSuccess');
const acceptConfirmation = require('./acceptConfirmation');
const waitForCoinBalance = require('./waitForCoinBalance');
const waitForCreateToken = require('./waitForCreateToken');
const setTokenAsSwap = require('./setTokenAsSwap');
const waitForToken = require('./waitForToken');
const waitForCreateNFT = require('./waitForCreateNFT');
const setAppPermission = require('./setAppPermission');
const acceptPermissionRequest = require('./acceptPermissionRequest');
const pause = require('./pause');

const helpers = {
  getByTestId,
  getWalletAddress,
  getCoinBalance,
  setTokenAsSwap,
  acceptBurn,
  acceptSuccess,
  acceptConfirmation,
  sendCoinsToAddress,
  waitForCoinBalance,
  waitForSendableCoins,
  waitForCreateToken,
  waitForToken,
  waitForCreateNFT,
  setAppPermission,
  acceptPermissionRequest,
  pause,
}

module.exports = helpers;
