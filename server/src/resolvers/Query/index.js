const { getUserId } = require('../../utils');
const list = require('./List');

async function user(root, args, context) {
  const userId = getUserId(context);
  return await context.prisma.user({ id: userId });
}

async function getItem(root, args, context) {
  return await context.prisma.item({ id: args.id });
}

module.exports = {
  user,
  getItem,
  ...list,
};
