const axios = require('axios');

async function acceptPermissionRequest(rpcUrl, appUid) {
  const response = await axios.get(`${rpcUrl}/mds action:pending`);
  const action = response.data.response.pending.reverse().find(app => app.minidapp.uid === appUid);
  return await axios.get(`${rpcUrl}/mds action:accept uid:${action.uid}`);
}

module.exports = acceptPermissionRequest;
