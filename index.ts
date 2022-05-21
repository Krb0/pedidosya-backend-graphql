import { ApolloServer, UserInputError, gql } from "apollo-server";
import "./db.ts";
import Restaurante from "./models/Restaurante";
import Orden from "./models/Orden";

const typeDefs = gql`
  enum Type {
    Restaurante
    Mascotas
  }
  type Orden {
    restaurante: String!
    platos: [String]!
    total: Int!
    usuario: String!
  }
  type Plato {
    _id: String!
    foto: String!
    nombre: String!
    descripcion: String!
    precio: Int!
  }
  type Restaurante {
    _id: ID!
    logo: String!
    tipo: Type!
    nombre: String!
    envio: Int!
    minimo: Int!
    simpleOpinion: simpleOpinion!
    platos: [Plato]!
    ordenes: [String]
  }
  type simpleOpinion {
    rating: Float!
    opinionCount: Int!
  }

  type Query {
    restaurantesCount: Int!
    restaurantes: [Restaurante]
    restaurante(id: String): Restaurante
  }
`;

const resolvers = {
  Query: {
    restaurantesCount: async () =>
      await Restaurante.collection.countDocuments(),
    restaurantes: async () => await Restaurante.find({}),
    restaurante: async (_: any, { id }: { id: string }) =>
      await Restaurante.findById(id),
  },
  Restaurante: {
    ordenes: async (restaurante: any) => {
      const restaurant = await Restaurante.findById(restaurante._id);
      if (restaurant.ordenes.length === 0) return "olaa";
      return restaurant.ordenes;
    },
    simpleOpinion: async (restaurante: any) => {
      const restaurant = await Restaurante.findById(restaurante._id);
      if (restaurant.ordenes.length === 0)
        return {
          rating: 2.5,
          opinionCount: 1,
        };
      let ratings = 0;
      for (let i = 0; i < restaurant.ordenes.length; i++) {
        const ordenDoc = await Orden.findById(restaurant.ordenes[i]);
        if (ordenDoc?.opinion) {
          ratings = +ordenDoc.opinion.puntaje;
        }
      }
      return {
        rating: ratings / restaurant.ordenes.length,
        opinionCount: restaurant.ordenes.length,
      };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`🚀  Server ready at ${url}`));
