async function pause(timeout = 500) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

module.exports = pause;
