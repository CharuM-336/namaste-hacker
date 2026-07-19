import { chunksCollection, ensureCollections } from "./apps/web/lib/db/astra.ts";

async function run() {
  await ensureCollections();
  
  const chunks = await chunksCollection().find({}, { limit: 5 }).toArray();
  console.log("Total chunks in DB:", chunks.length);
  process.exit(0);
}

run().catch(console.error);
