/**
 * creds to dynamitesushi & neil shah
 */

function getDataUrlFileSize(str: any) {
  const stringLength = str.length - "data:image/png;base64,".length;
  const bytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
  const kilobytes = bytes / 1000;
  const megabytes = kilobytes / 1000;

  return {
      bytes,
      kilobytes,
      megabytes
  };
}

export default getDataUrlFileSize;