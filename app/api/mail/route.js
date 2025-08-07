import { NextResponse } from 'next/server'
import { sendMail } from './mailFunctions'

export async function POST(req) {
  const { subject, to, type, data } = await req.json()
  try {
    const success = await sendMail({ subject, to, type, data })
    return NextResponse.json({ success })
  } catch (err) {
    console.error("Mail POST ERROR - ", err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}