const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, getUserId } = require('../utils');

async function signup(root, args, context) {
  const password = await bcrypt.hash(args.password, 10);

  const isNameExist = await context.prisma.$exists.user({ name: args.name });
  if (isNameExist) {
    throw new Error("Користувач з таким іменем уже існує");
  }

  const user = await context.prisma.createUser({
    name: args.name,
    password,
  });

  const token = jwt.sign({ userId: user.id }, SECRET_KEY);

  return { user, token };
}

async function login(root, args, context) {
  const user = await context.prisma.user({ name: args.name });
  if (!user) {
    throw new Error("Користувача з таким іменем не існує");
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
};
