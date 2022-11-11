const axios = require('axios');

function setAppPermission(rpcUrl, appUid, level) {
  return axios.get(`${rpcUrl}/mds action:permission uid:${appUid} trust:${level}`);
}

module.exports = setAppPermission;
