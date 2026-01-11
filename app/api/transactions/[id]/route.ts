import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../lib/mongodb';

const DB_NAME = "farmshop";
const COLLECTION_NAME = "transactions";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const { isPaid } = body;

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid transaction ID' }, { status: 400 });
    }

    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: objectId },
      { $set: { isPaid } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('PATCH error:', e);
    return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const updateData = {
      dealerId: body.dealerId,
      date: body.date,
      chickenCount: body.chickenCount,
      weightKg: body.weightKg,
      pricePerKg: body.pricePerKg,
      totalAmount: body.weightKg * body.pricePerKg,
      isPaid: body.isPaid || false,
      note: body.note || ''
    };

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid transaction ID' }, { status: 400 });
    }

    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Fetch the updated document
    const updatedDoc = await db.collection(COLLECTION_NAME).findOne({ _id: objectId });
    
    // Get dealer name for the response
    let dealerName = 'Unknown Dealer';
    if (updatedDoc.dealerId) {
      try {
        const dealer = await db.collection('dealers').findOne({ _id: new ObjectId(updatedDoc.dealerId) });
        if (dealer) dealerName = dealer.name;
      } catch (e) {
        console.error('Failed to fetch dealer name:', e);
      }
    }

    return NextResponse.json({
      ...updatedDoc,
      id: updatedDoc._id.toString(),
      dealerName,
      _id: undefined
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid transaction ID' }, { status: 400 });
    }

    const result = await db.collection(COLLECTION_NAME).deleteOne(
      { _id: objectId }
    );

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}