import { NextResponse } from 'next/server'
import { changePassword } from '../account/accountFunctions'
import { useCode, getCode } from './resetFunctions'
import { dbConnect } from '@/utils/dbMongo'
import md5 from 'md5'

const databaseConnection = dbConnect()

export async function POST(req) {
  const { password, code, email } = await req.json()

  try {
    await databaseConnection

    const isCodeValid = await getCode({ email, code, used: false })
    if (!isCodeValid) return NextResponse.json({ error: 'Invalid code or email' }, { status: 400 })

    await useCode(code)
    const success = await changePassword({ email }, { password: md5(password) })
    return NextResponse.json({ success })
  } catch (err) {
    console.error("Forgot POST ERROR - ", err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
