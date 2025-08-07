import { NextResponse } from 'next/server'
import Stripe from "stripe";
import { getUserToken } from '@/utils/protectRoute'
import { dbConnect } from '@/utils/dbMongo'
import { getOrders, createOrder } from '../order/orderFunctions'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const databaseConnection = dbConnect()

const deliveryPrice = 89

export async function POST(req) {
  const { products = [], delivery } = await req.json()
  try {
    const accountId = (await getUserToken(req))._id;
    if (!accountId) return NextResponse.json({ error: 'Account not found' }, { status: 400 });

    await databaseConnection
    const pendingOrder = await getOrders({ accountId, status: 'pending' });
    let orderId
    if (pendingOrder.length === 0) {
      const order = await createOrder({ accountId, products, delivery });
      await order.save();
      orderId = order._id;
    } else {
      orderId = pendingOrder[0]._id;
    }

    const referer = req.headers.get("referer");
    const url = referer ? new URL(referer) : null;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [...products.map((product) => ({
        price_data: {
          currency: 'czk',
          product_data: {
            name: product.type,
          },
          unit_amount: product.price * 100,
        },
        quantity: product.amount,
      })), {
        price_data: {
          currency: 'czk',
          product_data: {
            name: 'Delivery',
          },
          unit_amount: deliveryPrice * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${url.origin}/order/success?orderId=${orderId}`,
      cancel_url: `${url.origin}/order`,
    });

    return NextResponse.json({ success: true, id: session.id })
  } catch (err) {
    console.error("Order PUT ERROR - ", err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
