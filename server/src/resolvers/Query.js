function users(root, args, context) {
  return context.prisma.users();
}

module.exports = {
  users
};
