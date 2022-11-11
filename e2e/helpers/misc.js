function initInnerConsoleLog(page) {
  return page.on('console', consoleObj => {
    if (consoleObj.type() !== 'warning') {
      console.log(consoleObj.text());
    }
  })
}
