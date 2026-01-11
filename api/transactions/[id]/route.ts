
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = "farmshop";
const COLLECTION_NAME = "transactions";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { isPaid } = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { isPaid } }
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection(COLLECTION_NAME).deleteOne({
      _id: new ObjectId(params.id)
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
