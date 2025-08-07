import Order from '@/models/Order'
import Profile from '@/models/Profile'
import { findAllMongo, updateMongo } from '@/utils/dbMongo'
import { getProfile } from '../profile/profileFunctions'

export const createOrder = (data) => Order(data)

export const changeOrderStatus = (filter, status) => updateMongo(Order, filter, { status })

export const getOrders = async (filter = {}) => {
  const orders = await findAllMongo(Order, filter);
  const ordersWithProfiles = []
  await Promise.all(
    orders.map(async (order) => {
      order.profile = await getProfile({ accountId: order.accountId });

      ordersWithProfiles.push({ ...order })
    })
  );
  return ordersWithProfiles;
};

export const createProfile = (data) =>
  Profile(data).save()

