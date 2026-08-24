const HttpError = require('../utils/HttpError');

function autenticar(accessToken) {
  if (!accessToken || accessToken !== process.env.ACCESS_TOKEN) {
    throw new HttpError(401, 'access_token inválido');
  }
}

module.exports = { autenticar };
