import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
const schema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      minlength: 4,
    },
    foto: {
      type: String,
      required: true,
      minlength: 3,
    },
    ordenes: Array,
  },
  {
    collection: "Usuarios",
  }
);

schema.plugin(uniqueValidator);
export default mongoose.model("Usuario", schema);
