
/**
 * TO CONNECT YOUR MONGODB URL:
 * Create a file at `app/api/transactions/route.ts` in your Next.js project
 * and use the following code.
 * 
 * Install the driver first: npm install mongodb
 */

/* 
import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = "mongodb+srv://lakshan:<db_password>@mycluster.ptkz1tc.mongodb.net/?appName=MyCluster";
const client = new MongoClient(uri);

async function getCollection() {
  await client.connect();
  return client.db("farmshop").collection("transactions");
}

export async function GET() {
  const col = await getCollection();
  const data = await col.find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const col = await getCollection();
  
  const newDoc = {
    ...body,
    totalAmount: body.weightKg * body.pricePerKg,
    createdAt: Date.now(),
  };
  
  const result = await col.insertOne(newDoc);
  return NextResponse.json({ ...newDoc, id: result.insertedId });
}
*/

export const MONGODB_CONFIG = {
  url: "mongodb+srv://lakshan:<db_password>@mycluster.ptkz1tc.mongodb.net/?appName=MyCluster",
  dbName: "farmshop",
  collection: "transactions"
};
