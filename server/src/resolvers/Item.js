function list(root, args, context) {
  return context.prisma.item({ id: root.id }).list();
}

function members(root, args, context) {
  return context.prisma.item({ id: root.id }).members();
}

module.exports = {
  list,
  members,
};
