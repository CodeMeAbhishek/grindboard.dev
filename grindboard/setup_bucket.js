const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres.vsvkrksyuudakrvkxquk:Kalispbase3020@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
  });
  
  await client.connect();
  try {
    // Ensure bucket exists
    await client.query(`INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;`);
    console.log("Bucket ensured.");
    
    // Drop existing policies if any so we can recreate them
    await client.query(`DROP POLICY IF EXISTS "Public Access" ON storage.objects;`);
    await client.query(`DROP POLICY IF EXISTS "Auth Uploads" ON storage.objects;`);
    await client.query(`DROP POLICY IF EXISTS "Auth Updates" ON storage.objects;`);
    
    // Create policies
    await client.query(`CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'avatars' );`);
    await client.query(`CREATE POLICY "Auth Uploads" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'avatars' );`);
    await client.query(`CREATE POLICY "Auth Updates" ON storage.objects FOR UPDATE WITH CHECK ( bucket_id = 'avatars' );`);
    
    // Enable RLS just in case
    await client.query(`ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;`);

    console.log("Policies ensured.");
  } catch(e) {
    console.error("Error setting up storage:", e);
  } finally {
    await client.end();
  }
}

main();
