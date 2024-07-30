export function getAppUID() {
  const url = window.location.href;
  const matches = url.match(/0x([a-z]|[0-9])+/gi);

  if (matches) {
    return matches[0];
  }

  return "unknown-app-uid";
}

export default getAppUID;
