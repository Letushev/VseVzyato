const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../utils');
const user = require('./User');
const list = require('./List');
const item = require('./Item');

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

module.exports = {
  signup,
  login,
  ...user,
  ...list,
  ...item,
};
