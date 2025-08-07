import ForgotPassword from '@/models/ForgotPassword'
import { findMongo, updateMongo } from '@/utils/dbMongo'

export const getCode = async (filter) =>
  findMongo(ForgotPassword, filter)

export const useCode = async (code) =>
  updateMongo(ForgotPassword, { code }, { used: true })

