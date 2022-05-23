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
    fondo: String!
    nombre: String!
    envio: Int!
    minimo: Int!
    simpleOpinion: simpleOpinion!
    categorias: [Categoria]
    ordenes: [String]
  }
  type Categoria {
    nombre: String!
    platos: [Plato]
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
  type Mutation {
    addRestaurante(
      logo: String!
      tipo: Type!
      fondo: String!
      nombre: String!
      envio: Int!
      minimo: Int!
    ): Restaurante
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
  Mutation: {
    addRestaurante: async (_: any, args: any) => {
      const { logo, tipo, fondo, nombre, envio, minimo } = args;
      const newRestaurante = new Restaurante({
        logo,
        tipo,
        fondo,
        nombre,
        envio,
        minimo,
      });
      await newRestaurante.save();
      return newRestaurante;
    },
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
