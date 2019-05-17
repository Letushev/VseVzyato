function lists(root, args, context) {
  return context.prisma.user({ id: root.id }).lists();
}

function memberLists(root, args, context) {
  return context.prisma.user({ id: args.id }).memberLists();
}

module.exports = {
  lists,
  memberLists,
};
