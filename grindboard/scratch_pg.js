const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres.vsvkrksyuudakrvkxquk:Kalispbase3020@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
  });
  
  await client.connect();
  const res = await client.query(`UPDATE "modules" SET description = REPLACE(description, ' (Striver A2Z)', '') WHERE name = 'DSA' RETURNING *;`);
  console.log("Updated rows:", res.rowCount);
  await client.end();
}

main().catch(console.error);
