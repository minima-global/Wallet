const getByTestId = require('./getByTestId');
const pause = require('./pause');

async function acceptConfirmation(page) {
  await page.waitForSelector(getByTestId('Confirmation_next'));
  await page.click(getByTestId('Confirmation_next'));
  await page.waitForSelector(getByTestId('Confirmation_next'), { hidden: true });
  await pause();
}

module.exports = acceptConfirmation;
