import { NextResponse } from 'next/server'
import { dbConnect } from '@/utils/dbMongo'
import { protectRoute } from '@/utils/protectRoute'
import Profile from '@/models/Profile'

const databaseConnection = dbConnect()

export async function POST(req) {
  const errorResponse = await protectRoute(req, ['admin'])
  if (errorResponse) return errorResponse

  try {
    await databaseConnection

    // Přidáme nová pole do všech existujících dokumentů, pokud ještě neexistují
    await Profile.updateMany(
      { accentColor: { $exists: false } },
      { $set: { accentColor: '#000' } } // default hodnota
    )

    await Profile.updateMany(
      { background: { $exists: false } },
      { $set: { background: "default.jpg" } } // default hodnota
    )

    return NextResponse.json({ message: 'Databáze byla úspěšně aktualizována.' })
  } catch (err) {
    console.error('Database Update ERROR - ', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
