const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const List = require('./resolvers/List');
const Item = require('./resolvers/Item');

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    User,
    List,
    Item,
  },
  context: req => ({ ...req, prisma }),
});

server.start(() => console.log('Ready...'));
