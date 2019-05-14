const jwt = require('jsonwebtoken');
const SECRET_KEY = 'VzyatoVse_2120_Secret';

function getUserId(context) {
  const Authorization = context.request.get('Authorization');

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, SECRET_KEY);
    return userId;
  }

  throw new Error('Not authenticated');
}

module.exports = {
  SECRET_KEY,
  getUserId,
};
