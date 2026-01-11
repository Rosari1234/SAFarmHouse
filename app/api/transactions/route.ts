
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

const DB_NAME = "farmshop";
const COLLECTION_NAME = "transactions";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const transactions = await db.collection(COLLECTION_NAME)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Get all unique dealer IDs
    const dealerIds = [...new Set(transactions.map(t => t.dealerId).filter(id => id))];
    const dealers = dealerIds.length > 0 ? await db.collection('dealers')
      .find({ _id: { $in: dealerIds.map(id => new ObjectId(id)) } })
      .toArray() : [];

    // Create dealer name map
    const dealerMap = new Map(dealers.map(d => [d._id.toString(), d.name]));

    // Map _id to id and add dealerName
    const formatted = transactions.map(t => ({
      ...t,
      id: t._id.toString(),
      dealerName: dealerMap.get(t.dealerId) || 'Unknown Dealer',
      _id: undefined
    }));

    return NextResponse.json(formatted);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const newTransaction = {
      ...body,
      totalAmount: body.weightKg * body.pricePerKg,
      createdAt: Date.now(),
      isPaid: body.isPaid || false
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(newTransaction);
    
    // Get dealer name for the response
    let dealerName = 'Unknown Dealer';
    if (body.dealerId) {
      try {
        const dealer = await db.collection('dealers').findOne({ _id: new ObjectId(body.dealerId) });
        if (dealer) dealerName = dealer.name;
      } catch (e) {
        console.error('Failed to fetch dealer name:', e);
      }
    }
    
    return NextResponse.json({
      ...newTransaction,
      id: result.insertedId.toString(),
      dealerName
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
