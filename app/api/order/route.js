import { NextResponse } from 'next/server'
import { dbConnect } from '@/utils/dbMongo'
import { getUserToken, protectRoute } from '@/utils/protectRoute'
import { getOrders } from './orderFunctions'

const databaseConnection = dbConnect()

export async function GET(req) {
  const errorResponse = await protectRoute(req, ["user", "admin"])
  if (errorResponse) return errorResponse

  try {
    await databaseConnection
    const accountId = (await getUserToken(req))._id
    const orders = await getOrders({ accountId })
    return NextResponse.json({ success: !!orders, orders })
  } catch (err) {
    console.error("Order GET ERROR - ", err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
