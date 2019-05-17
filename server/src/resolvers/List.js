function createdBy(root, args, context) {
  return context.prisma.list({ id: root.id }).createdBy();
}

function categories(root, args, context) {
  return context.prisma.list({ id: root.id }).categories();
}

function members(root, args, context) {
  return context.prisma.list({ id: root.id }).members();
}

function items(root, args, context) {
  return context.prisma.list({ id: root.id }).items();
}

module.exports = {
  createdBy,
  categories,
  members,
  items,
};
