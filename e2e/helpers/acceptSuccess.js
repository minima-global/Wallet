const getByTestId = require('./getByTestId');

async function acceptSuccess(page) {
  try {
    await page.waitForSelector(getByTestId('confirm'));
    await page.click(getByTestId('confirm'));
  } catch {
    await page.screenshot({ path: '../screenshots/failure.png' });
  }
}

module.exports = acceptSuccess;
