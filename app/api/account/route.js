import { NextResponse } from 'next/server'
import { dbConnect } from '@/utils/dbMongo'
import { protectRoute } from '@/utils/protectRoute'
import { createAccount, getAccounts, getAccount, emailExists } from '@/app/api/account/accountFunctions'
import { createProfile } from '@/app/api/profile/profileFunctions'

const databaseConnection = dbConnect()

export async function GET(req) {
  // Get all accounts
  const errorResponse = await protectRoute(req, ["admin"])
  if (errorResponse) return errorResponse
  
  try {
    await databaseConnection
    const accounts = await getAccounts()
    return NextResponse.json({ success: true, accounts })
  } catch (err) {
    console.error("Account GET ERROR - ", err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req) {
  // Log in
  const { email, password } = await req.json()
  
  try {
    await databaseConnection
    const account = await getAccount({ email, password })
    return NextResponse.json({ success: !!account, account })
  } catch (err) {
    console.error("Account POST ERROR - ", err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req) {
  // Create account
  const { password, email, name, surname } = await req.json()
  
  try {
    await databaseConnection
    
    // Check if email already exists
    const emailAlreadyExists = await emailExists(email)
    if (emailAlreadyExists) {
      return NextResponse.json({ 
        error: 'Email already exists', 
        success: false 
      }, { status: 400 })
    }
    
    const account = await createAccount({ password, email, name, surname })
    if (!account) {
      return NextResponse.json({ error: 'Account creation failed' }, { status: 400 })
    }
    
    const profile = await createProfile({ accountId: account._id, name, surname })
    if (!profile) {
      return NextResponse.json({ error: 'Profile creation failed' }, { status: 400 })
    }
    
    await account.save()
    await profile.save()
    
    return NextResponse.json({ success: !!account && !!profile })
  } catch (err) {
    console.error("Account PUT ERROR - ", err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}