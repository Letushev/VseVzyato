const { getUserId } = require('../../utils');

async function createList(root, args, context) {
  const userId = getUserId(context);
  return await context.prisma.createList({
    name: args.name,
    createdBy: {
      connect: {
        id: userId,
      },
    },
  });
}

async function deleteList(root, args, context) {
  return await context.prisma.deleteList({ id: args.id });
}

module.exports = {
  createList,
  deleteList,
};
