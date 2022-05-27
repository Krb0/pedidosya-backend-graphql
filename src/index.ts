import { ApolloServer } from 'apollo-server';
import typeDefs from './types';
import resolvers from './resolvers';
import './db.ts';

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`🚀  Server ready at ${url}`));
