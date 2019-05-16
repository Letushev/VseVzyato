const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, getUserId } = require('../utils');

async function signup(root, args, context) {
  const password = await bcrypt.hash(args.password, 10);

  const exist = await context.prisma.$exists.user({ nick: args.nick });
  if (exist) {
    throw new Error("Користувач з таким нікнеймом уже існує");
  }

  const user = await context.prisma.createUser({
    nick: args.nick,
    name: args.name,
    password,
    avatar: args.avatar,
  });

  const token = jwt.sign({ userId: user.id }, SECRET_KEY);

  return { user, token };
}

async function login(root, args, context) {
  const user = await context.prisma.user({ nick: args.nick });
  if (!user) {
    throw new Error("Користувача з таким нікнеймом не існує");
  }

  const isValid = await bcrypt.compare(args.password, user.password);
  if (!isValid) {
    throw new Error("Неправильний пароль");
  }

  const token = jwt.sign({ userId: user.id }, SECRET_KEY);

  return { user, token };
}

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


module.exports = {
  signup,
  login,
  editUser,
};
