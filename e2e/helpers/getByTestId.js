function getByTestId(testId, { input = false } = { input: false }) {
  if (input) {
    return `[data-testid="${testId}"] input`;
  }

  return `[data-testid="${testId}"]`;
}

module.exports = getByTestId;
