const { getUserId } = require('../utils');

async function user(root, args, context) {
  const userId = getUserId(context);
  return await context.prisma.user({ id: userId });
}

module.exports = {
  user
};
