import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    rights: {
      type: [String],
      default: ["user"],
    },
  },
  { timestamps: true },
);

const declareModel = () => {
  try {
    const model = mongoose.model('accounts');
    return model;
  } catch {
    return mongoose.model('accounts', accountSchema);
  }
};

module.exports = declareModel();
