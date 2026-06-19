const fs = require('fs');
const https = require('https');
const path = require('path');

const logos = [
  { name: 'meta.png', url: 'https://logo.clearbit.com/meta.com' },
  { name: 'google.png', url: 'https://logo.clearbit.com/google.com' },
  { name: 'facebook.png', url: 'https://logo.clearbit.com/facebook.com' },
  { name: 'amazon.png', url: 'https://logo.clearbit.com/amazon.com' },
  { name: 'netflix.png', url: 'https://logo.clearbit.com/netflix.com' }
];

const dir = path.join(__dirname, 'public', 'logos');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, function(response) {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', function() {
        file.close(resolve);
      });
    }).on('error', function(err) {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function main() {
  for (const logo of logos) {
    console.log(`Downloading ${logo.name}...`);
    try {
      await download(logo.url, path.join(dir, logo.name));
    } catch (e) {
      console.error(`Failed to download ${logo.name}:`, e);
    }
  }
  console.log("Done!");
}

main();
