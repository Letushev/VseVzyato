function createdBy(root, args, context) {
  return context.prisma.list({ id: root.id }).createdBy();
}

function members(root, args, context) {
  return context.prisma.list({ id: root.id }).members();
}

function items(root, args, context) {
  return context.prisma.list({ id: root.id }).items();
}

module.exports = {
  createdBy,
  members,
  items,
};
