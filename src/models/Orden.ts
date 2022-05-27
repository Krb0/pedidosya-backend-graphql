import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
const schema = new mongoose.Schema(
  {
    restaurante: {
      type: String,
      required: true,
      minlength: 3,
    },
    platos: {
      type: Array,
      required: true,
    },
    total: {
      type: Number,
      required: true,
      minlength: 4,
    },
    usuario: {
      type: String,
      required: true,
      minlength: 3,
    },
    opinion: {
      mensaje: {
        type: String,
      },
      puntaje: {
        type: Number,
      },
    },
    ordenes: {
      type: Array,
      required: false,
    },
  },
  {
    collection: "Ordenes",
  }
);

schema.plugin(uniqueValidator);
export default mongoose.model("Ordenes", schema);
