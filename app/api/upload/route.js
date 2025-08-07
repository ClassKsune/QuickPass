import { protectRoute } from '@/utils/protectRoute';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const fileType = file.type;

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    if (fileType !== 'image/svg+xml') return NextResponse.json({ error: 'Only SVG files are allowed' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), 'public/uploads/cards', fileName);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ success: true, url: `/uploads/cards/${fileName}` }, { status: 200 });
  } catch (err) {
    console.error('Upload POST ERROR - ', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
