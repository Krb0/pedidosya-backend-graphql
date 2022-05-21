import { ApolloServer, UserInputError, gql } from "apollo-server";
import "./db.ts";
import Restaurante from "./models/Restaurante";

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
    platos: [Plato]!
    ordenes: [String]!
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
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`🚀  Server ready at ${url}`));

// without mongodb
/* const typeDefs = gql`
  enum YesNo {
    YES
    NO
  }
  type Address {
    street: String!
    city: String!
  }
  type Person {
    name: String!
    phone: String
    address: Address!
    check: String!
    canDrink: Boolean!
    id: ID!
  }
  type Query {
    personCount: Int!
    persons(phone: YesNo): [Person]!
    personsCanDrink: [Person]!
    personsPhoneDefault: [String]!
    findPersonByName(name: String!): Person
  }
  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    removePerson(name: String!): Person
    editNumber(name: String!, phone: String!): Person
  }
`;

const resolvers = {
  Query: {
    personCount: () => persons.length,
    persons: async (root, args) => {
      if (!args.phone) return persons;
      const byPhone = (person) =>
        args.phone === "YES" ? person.phone : !person.phone;
      return persons.filter(byPhone);
    },
    personsCanDrink: () => persons.filter((person) => person.age >= 18),
    personsPhoneDefault: () =>
      persons.map(({ phone }) => (phone ? phone : "01234567")),
    findPersonByName: (root, { name }) =>
      persons.find((person) => person.name === name),
  },
  Person: {
    check: () => "check",
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
    canDrink: (root) => root.age >= 18,
  },
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find((person) => person.name === args.name))
        throw new UserInputError("Name must be unique", {
          invalidArgs: args.name,
        });
      const person = { ...args, id: uuid() };
      persons.push(person);
      return person;
    },
    removePerson: (root, args) => {
      const person = persons.find((person) => person.name === args.name);
      persons = persons.filter((person) => person.name !== args.name);
      return person;
    },
    editNumber: (root, args) => {
      const personIndex = persons.findIndex(
        (person) => person.name === args.name
      );
      if (personIndex === -1) return null;
      const person = persons[personIndex];
      const updatedPerson = { ...person, phone: args.phone };
      persons[personIndex] = updatedPerson;
      return updatedPerson;
    },
  },
};
 */
