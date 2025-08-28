import { NextResponse } from 'next/server'
import { dbConnect } from '@/utils/dbMongo'
import { protectRoute } from '@/utils/protectRoute'
import Account from '@/models/Account'
import { createAccount, getAccounts, getAccount } from '@/app/api/account/accountFunctions'
import { createProfile } from '@/app/api/profile/profileFunctions'

const databaseConnection = dbConnect()

export async function GET(req) {
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
  const { password, email, name, surname } = await req.json()
  await databaseConnection

  try {
    // createAccount vrací jen dokument, neuložený v DB
    const accountDoc = createAccount({ password, email, name, surname })
    if (!accountDoc) {
      return NextResponse.json({ error: 'Account creation failed' }, { status: 400 })
    }

    // Uložíme účet do DB
    const account = await accountDoc.save()

    // Pokusíme se vytvořit profil
    try {
      const profileDoc = await createProfile({ accountId: account._id, name, surname })
      if (!profileDoc) {
        await Account.findByIdAndDelete(account._id) // rollback
        return NextResponse.json({ error: 'Profile creation failed' }, { status: 400 })
      }

      await profileDoc.save()
      return NextResponse.json({ success: true, account, profile: profileDoc })
    } catch (profileErr) {
      // pokud selže profil, smažeme účet
      await Account.findByIdAndDelete(account._id)
      throw profileErr
    }
  } catch (err) {
    console.error("Account PUT ERROR - ", err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
