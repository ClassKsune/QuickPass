import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URL

if (!MONGODB_URI)
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )

let cached = { conn: null, promise: null }

export const stringToObjectId = (string) => mongoose.Types.ObjectId.createFromHexString(string)

export const dbConnect = async () => {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export const findMongo = async (collection, filter = {}, sort = {}) => {
  return await collection
    .findOne(filter)
    .sort(sort)
    .lean()
    .then((data) => data)
    .catch(() => null)
}

export const findAllMongo = async (collection, filter = {}) => {
  return await collection
    .find(filter)
    .lean()
    .then((data) => data)
    .catch(() => null)
}

export const findXMongo = async (collection, limit, filter = {}) => {
  return await collection
    .find(filter)
    .sort({ date: -1, createdAt: -1 })
    .limit(limit)
    .lean()
    .then((data) => data)
    .catch(() => null)
}

export const updateMongo = async (collection, filter = {}, update = {}) => {
  return await collection
    .updateOne(filter, update)
    .lean()
    .then((data) => data.modifiedCount > 0)
    .catch(() => null)
}

export const deleteMongo = async (collection, filter = {}) => {
  return await collection
    .deleteOne(filter)
    .lean()
    .then((data) => data)
    .catch(() => null)
}
