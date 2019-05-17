const { getUserId } = require('../../utils');
const list = require('./List');

async function user(root, args, context) {
  const userId = getUserId(context);
  return await context.prisma.user({ id: userId });
}

module.exports = {
  user,
  ...list,
};
