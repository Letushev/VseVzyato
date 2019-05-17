const { getUserId } = require('../../utils');

async function user(root, args, context) {
  const userId = getUserId(context);
  return await context.prisma.user({ id: userId });
}

async function getLists(root, args, context) {
  const userId = getUserId(context);
  return await context.prisma.user({ id: userId }).lists();
}

async function getMemberLists(root, args, context) {
  const userId = getUserId(context);
  return await context.prisma.user({ id: userId }).memberLists();
}

module.exports = {
  user,
  getLists,
  getMemberLists,
};
