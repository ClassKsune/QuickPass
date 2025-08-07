import { NextResponse } from 'next/server'
import { dbConnect } from '@/utils/dbMongo'
import { getOrders, changeOrderStatus } from '../orderFunctions'
import { sendMail } from '../../mail/mailFunctions'

const databaseConnection = dbConnect()

export async function GET(req) {
  const orderId = req.nextUrl.searchParams.get('orderId');
  try {
    await databaseConnection
    const success = await changeOrderStatus({ _id: orderId }, 'completed')
    const order = (await getOrders({ _id: orderId }))[0]
    await sendMail({ subject: "New order", type: "order", data: order })
    return NextResponse.json({ success: !!success })
  } catch (err) {
    console.error("Order GET ERROR - ", err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
