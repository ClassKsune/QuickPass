import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'accounts',
    },
    products: {
      type: [{
        url: {
          type: String,
          required: true,
        },
        variant: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      }],
      required: true,
    },
    delivery: {
      type: {
        country: { type: String, required: true },
        name: { type: String, required: true },
        surname: { type: String, required: true },
        address: { type: String, required: true },
        postalCode: { type: String, required: true },
        phone: { type: String, required: true },
        packet: { type: String, required: true },
      },
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

const declareModel = () => {
  try {
    const model = mongoose.model('orders');
    return model;
  } catch {
    return mongoose.model('orders', orderSchema);
  }
};

module.exports = declareModel();
