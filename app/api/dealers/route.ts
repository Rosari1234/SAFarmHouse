import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

const DB_NAME = "farmshop";
const COLLECTION_NAME = "dealers";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const dealers = await db.collection(COLLECTION_NAME)
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(dealers.map(d => ({
      id: d._id.toString(),
      name: d.name,
      createdAt: d.createdAt
    })));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch dealers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const newDealer = {
      name: body.name,
      createdAt: Date.now()
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(newDealer);

    return NextResponse.json({
      id: result.insertedId.toString(),
      name: newDealer.name,
      createdAt: newDealer.createdAt
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to add dealer' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name } = body;
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid dealer ID' }, { status: 400 });
    }

    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: objectId },
      { $set: { name } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update dealer' }, { status: 500 });
  }
}