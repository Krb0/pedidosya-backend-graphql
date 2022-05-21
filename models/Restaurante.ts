import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
const schema = new mongoose.Schema(
  {
    logo: {
      type: String,
      required: true,
      unique: true,
      minlength: 4,
    },
    nombre: {
      type: String,
      required: true,
      minlength: 3,
    },
    tipo: {
      type: String,
      required: true,
      minlength: 4,
    },
    envio: {
      type: Number,
      required: true,
      minlength: 3,
    },
    minimo: {
      type: String,
      required: true,
      minlength: 3,
    },
    platos: Array,
    ordenes: Array,
  },
  {
    collection: "Restaurantes",
  }
);

schema.plugin(uniqueValidator);
export default mongoose.model("Restaurantes", schema);
