import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
    },
    used: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 30 * 60 * 1000), // 30 minut od vytvoření
    }
  },
  { timestamps: true }
);

forgotPasswordSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const declareModel = () => {
  try {
    const model = mongoose.model('forgotPasswords');
    return model;
  } catch {
    return mongoose.model('forgotPasswords', forgotPasswordSchema);
  }
};

module.exports = declareModel();