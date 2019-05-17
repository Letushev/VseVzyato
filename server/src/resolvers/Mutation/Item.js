async function createItem(root, args, context) {
  const membersToConnect = args.members ? args.members.map(id => ({ id })) : [];
  return await context.prisma.createItem({
    name: args.name,
    count: args.count,
    priority: args.priority,
    list: {
      connect: {
        id: args.listId,
      },
    },
    members: {
      connect: membersToConnect,
    },
  });
}

async function deleteItem(root, args, context) {
  return await context.prisma.deleteItem({ id: args.id });
}

async function editItem(root, args, context) {
  const { name, count, members, priority } = args;

  const fragment = `fragment Ids on User { id } `;
  const notMembers = await context.prisma.item({ id: args.id }).members().$fragment(fragment);

  if (members) {
    await context.prisma.updateItem({
      data: {
        members: {
          disconnect: notMembers,
        },
      },
      where: {
        id: args.id,
      }
    });
  }

  return await context.prisma.updateItem({
    data: {
      ...name && { name },
      ...count && { count },
      ...priority && { priority },
      ...members && {
        members: {
          connect: members.map(id => ({ id })),
        },
      },
    },
    where: {
      id: args.id,
    },
  });
}

module.exports = {
  createItem,
  deleteItem,
  editItem,
};
