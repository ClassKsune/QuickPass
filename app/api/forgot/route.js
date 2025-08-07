import { NextResponse } from 'next/server'
import { sendMail } from '../mail/mailFunctions'
import { dbConnect } from '@/utils/dbMongo'

const databaseConnection = dbConnect()

export async function POST(req) {
  const { email } = await req.json()

  try {
    await databaseConnection

    const success = await sendMail({ subject: "Forgotten password", to: email, type: "forgot" })
    return NextResponse.json({ success })
  } catch (err) {
    console.error("Forgot POST ERROR - ", err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
