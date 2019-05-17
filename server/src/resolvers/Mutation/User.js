const { getUserId } = require('../../utils');

async function editUser(root, args, context) {
  const userId = getUserId(context);
  return await context.prisma.updateUser({
    data: {
      ...!!args.avatar && {
        avatar: args.avatar,
      },
      ...!!args.name && {
        name: args.name,
      },
    },
    where: {
      id: userId,
    }
  });
}

async function inviteUser(root, args, context) {
  const user = await context.prisma.user({ nick: args.nick });
  if (!user) {
    throw new Error("Такого користувача не існує");
  }

  await context.prisma.updateList({
    data: {
      members: {
        connect: {
          id: user.id
        }
      }
    },
    where: {
      id: args.listId,
    },
  });

  return user;
}

async function refuseUser(root, args, context) {
  const user = await context.prisma.user({ nick: args.nick });

  await context.prisma.updateList({
    data: {
      members: {
        disconnect: {
          id: user.id
        }
      }
    },
    where: {
      id: args.listId,
    },
  });

  return user;
}

module.exports = {
  editUser,
  inviteUser,
  refuseUser,
};
