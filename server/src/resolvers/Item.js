function category(root, args, context) {
  return context.prisma.item({ id: root.id }).category();
}

module.exports = {
  category,
};
