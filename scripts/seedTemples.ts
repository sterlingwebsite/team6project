import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { MongoClient } from 'mongodb';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.MONGODB_DB || "team6project";

export interface ITemple {
  slug: string;
  name: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  city: string;
  state: string | null;
  country: string;
  phone: string | null;
}

export function generateTempleSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, "-");
}

async function runSeed() {
  console.log("⏳ Initializing robust database generation and data ingestion pipeline...");
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection('temples');

    const csvPath = path.join(process.cwd(), 'data/temples.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');

    const records = parse(csvContent, {
      columns: true,
        skip_empty_lines: true,
      relax_quotes: true,
    });

    const templesToUpload: ITemple[] = records.map((row: any) => {
      const name = row['Temple'] || '';
      
      return {
        slug: generateTempleSlug(name),
        name: name,
        status: row['Status'] || '',
        latitude: row['Latitude'] ? parseFloat(row['Latitude']) : null,
        longitude: row['Longitude'] ? parseFloat(row['Longitude']) : null,
        address: row['Address'] || null,
        city: row['City'] || '',
        state: row['State'] || null,
        country: row['Country'] || '',
        phone: row['Phone'] || null,
      };
    }).filter((temple: ITemple) => temple.name !== '');

    await collection.deleteMany({});
    
    const uploadResult = await collection.insertMany(templesToUpload as any);

    console.log(`\nDatabase Successfully Seeded!`);
    console.log(`Provisioned Database: "${DB_NAME}"`);
    console.log(`Loaded ${uploadResult.insertedCount} temples directly into MongoDB.`);
  } catch (error) {
    console.error("Database initialization crashed:", error);
  } finally {
    await client.close();
  }
}

runSeed();
