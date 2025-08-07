import Account from '@/models/Account'
import md5 from 'md5'
import { findAllMongo, findMongo, updateMongo } from '@/utils/dbMongo'

export const createAccount = ({ email, password, name, surname }) =>
  Account({ email, password: md5(password), name, surname })

export const getAccounts = (filter = {}) =>
  findAllMongo(Account, filter)

export const getAccount = ({ email, password }) =>
  findMongo(Account, { email, password: md5(password) })

export const changePassword = (filter, update) =>
  updateMongo(Account, filter, update)
