import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const Schema = mongoose.Schema;

const generateProfileUrl = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const profileSchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'accounts',
    },
    url: {
      type: String,
      unique: true,
      default: generateProfileUrl,
    },
    alias: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    socials: {
      type: [{
        _id: { type: String, default: uuidv4 },
        url: { type: String },
      }],
      default: [],
    },
    links: {
      type: [{
        _id: { type: String, default: uuidv4 },
        name: { type: String },
        description: { type: String },
        url: { type: String },
        iconUrl: { type: String },
      }],
      default: [],
    },
    videos: {
      type: [{
        _id: { type: String, default: uuidv4 },
        url: { type: String },
      }],
      default: [],
    },
  },
  { timestamps: true },
);

profileSchema.pre('save', function (next) {
  if (!this.url) {
    this.url = generateProfileUrl();
  }
  this.socials.forEach(social => {
    if (!social._id) social._id = uuidv4();
  });
  this.links.forEach(link => {
    if (!link._id) link._id = uuidv4();
  });
  this.videos.forEach(video => {
    if (!video._id) video._id = uuidv4();
  });
  next();
});

const declareModel = () => {
  try {
    const model = mongoose.model('profiles');
    return model;
  } catch {
    return mongoose.model('profiles', profileSchema);
  }
};

module.exports = declareModel();
