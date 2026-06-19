const { Client } = require('pg');
const fs = require('fs');

async function setupCron() {
  // Read .env to get the connection string
  const envFile = fs.readFileSync('.env', 'utf8');
  let connectionString = '';
  const lines = envFile.split('\n');
  for (const line of lines) {
    if (line.startsWith('DIRECT_URL=')) {
      connectionString = line.split('=')[1].trim();
      break;
    }
  }

  if (!connectionString) {
    for (const line of lines) {
      if (line.startsWith('DATABASE_URL=')) {
        connectionString = line.split('=')[1].trim();
        break;
      }
    }
  }

  if (!connectionString) {
    console.error('Could not find DIRECT_URL or DATABASE_URL in .env');
    process.exit(1);
  }

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase database.');

    // Enable pg_net
    await client.query('CREATE EXTENSION IF NOT EXISTS pg_net;');
    console.log('Ensured pg_net extension is enabled.');

    // Enable pg_cron
    await client.query('CREATE EXTENSION IF NOT EXISTS pg_cron;');
    console.log('Ensured pg_cron extension is enabled.');

    // Setup sync cron
    const syncSql = `
      SELECT cron.schedule(
        'grindboard-sync',
        '0 * * * *',
        $$
          SELECT net.http_post(
              url:='https://www.grindboard.dev/api/cron/sync',
              headers:='{"Authorization": "Bearer grindboard-secure-cron-2026"}'::jsonb
          );
        $$
      );
    `;
    await client.query(syncSql);
    console.log('Scheduled grindboard-sync cron job (Hourly).');

    // Setup events cron
    const eventsSql = `
      SELECT cron.schedule(
        'grindboard-events',
        '0 */12 * * *',
        $$
          SELECT net.http_post(
              url:='https://www.grindboard.dev/api/cron/events',
              headers:='{"Authorization": "Bearer grindboard-secure-cron-2026"}'::jsonb
          );
        $$
      );
    `;
    await client.query(eventsSql);
    console.log('Scheduled grindboard-events cron job (Every 12 Hours).');

    console.log('\\nSUCCESS! Cron jobs are injected into your Supabase database.');
  } catch (err) {
    console.error('Error setting up cron:', err);
  } finally {
    await client.end();
  }
}

setupCron();
