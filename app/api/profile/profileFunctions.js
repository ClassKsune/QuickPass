import Profile from '@/models/Profile'
import { findMongo, updateMongo } from '@/utils/dbMongo'

export const getProfile = async (filter) =>
  findMongo(Profile, filter)

export const updateProfile = async (filter, update) =>
  updateMongo(Profile, filter, update)

export const createProfile = async (data) =>
  Profile(data)
