import { gql } from 'apollo-server';

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

export default typeDefs;
