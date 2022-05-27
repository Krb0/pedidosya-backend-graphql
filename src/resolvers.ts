import Restaurante from './models/Restaurante';
import Orden from './models/Orden';

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
      if (restaurant.ordenes.length === 0) return 'olaa';
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
export default resolvers;
