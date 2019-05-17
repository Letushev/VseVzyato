const { getUserId } = require('../../utils');

async function getLists(root, args, context) {
  const userId = getUserId(context);
  return await context.prisma.user({ id: userId }).lists();
}

async function getMemberLists(root, args, context) {
  const userId = getUserId(context);
  return await context.prisma.user({ id: userId }).memberLists();
}

async function getList(root, args, context) {
  return await context.prisma.list({ id: args.id });
}

module.exports = {
  getList,
  getLists,
  getMemberLists,
};
