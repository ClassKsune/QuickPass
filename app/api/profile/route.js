import { NextResponse } from 'next/server'
import { dbConnect } from '@/utils/dbMongo'
import { getUserToken, protectRoute } from '@/utils/protectRoute'
import { getProfile, updateProfile } from './profileFunctions'

const databaseConnection = dbConnect()

export async function GET(req) {
  // Get profile
  try {
    const isMyAccount = req.nextUrl.searchParams.get('myAccount');
    const id = req.nextUrl.searchParams.get('id');
    if (!id && !isMyAccount) return NextResponse.json({ error: 'Identifier is required' }, { status: 400 });

    await databaseConnection
    if (isMyAccount) {
      const token = await getUserToken(req)
      if (!token) return NextResponse.json({ error: 'User is not logged in' }, { status: 401 })

      const accountId = token._id
      const profile = await getProfile({ accountId })
      return NextResponse.json({ success: !!profile, profile })
    } else {
      const profile = await getProfile({ $or: [
        { url: id },
        { alias: { $ne: null, $eq: id } }
      ] })
      return NextResponse.json({ success: !!profile, profile })
    }
  } catch (err) {
    console.error("Profile GET ERROR - ", err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req) {
  const { newProfile } = await req.json()
  const errorResponse = await protectRoute(req, ["user", "admin"])
  if (errorResponse) return errorResponse

  try {
    await databaseConnection
    const accountId = (await getUserToken(req))._id
    const success = await updateProfile({ accountId }, { ...newProfile })
    return NextResponse.json({ success })
  } catch (err) {
    console.error("Profile POST ERROR - ", err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req) {
  const {  } = await req.json()
  try {
    await databaseConnection
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Profile PUT ERROR - ", err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
