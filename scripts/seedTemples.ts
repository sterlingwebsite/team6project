// scripts/seedTemples.ts
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { MongoClient, Document } from 'mongodb';
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
  imageUrl: string;
}

interface ICsvTempleRow {
  Temple?: string;
  Status?: string;
  Latitude?: string;
  Longitude?: string;
  Address?: string;
  City?: string;
  State?: string;
  Country?: string;
  Phone?: string;
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
    }) as ICsvTempleRow[];

    const templesToUpload: ITemple[] = records.map((row: ICsvTempleRow) => {
      const name = row['Temple'] || '';
      const slug = generateTempleSlug(name);
      
      const churchAssetUrl = `https://churchofjesuschrist.org/${slug}-main.jpg`;
      const templeDbProxyUrl = `https://templedb.org/${encodeURIComponent(churchAssetUrl)}`;

      return {
        slug: slug,
        name: name,
        status: row['Status'] || '',
        latitude: row['Latitude'] ? parseFloat(row['Latitude']) : null,
        longitude: row['Longitude'] ? parseFloat(row['Longitude']) : null,
        address: row['Address'] || null,
        city: row['City'] || '',
        state: row['State'] || null,
        country: row['Country'] || '',
        phone: row['Phone'] || null,
        imageUrl: templeDbProxyUrl,
      };
    }).filter((temple: ITemple) => temple.name !== '');

    await collection.deleteMany({});
    
    const uploadResult = await collection.insertMany(templesToUpload as unknown as Document[]);

    console.log(`\nDatabase Successfully Seeded!`);
    console.log(`Provisioned Database: "${DB_NAME}"`);
    console.log(`Loaded ${uploadResult.insertedCount} temples with integrated TempleDB image paths into MongoDB.`);
  } catch (error) {
    console.error("Database initialization crashed:", error);
  } finally {
    await client.close();
  }
}

runSeed();
