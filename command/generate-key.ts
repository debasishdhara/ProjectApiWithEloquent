import fs from 'fs';
import crypto from 'crypto';

// Generate a random string
const jwtSecret = crypto.randomBytes(32).toString('hex');
// Generate a random 2nd string
const refreshTokenSecret = crypto.randomBytes(32).toString('hex');

fs.readFile('.env', 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Error reading .env file', err);
      return;
    }
  
    let envContent = data || '';
  
    // Replace or add JWT_SECRET
    if (/JWT_SECRET=.*/.test(envContent)) {
      envContent = envContent.replace(/JWT_SECRET=.*/, `JWT_SECRET=${jwtSecret}`);
    } else {
      envContent += `\nJWT_SECRET=${jwtSecret}`;
    }
  
    // Replace or add REFRESH_TOKEN_SECRET
    if (/REFRESH_TOKEN_SECRET=.*/.test(envContent)) {
      envContent = envContent.replace(/REFRESH_TOKEN_SECRET=.*/, `REFRESH_TOKEN_SECRET=${refreshTokenSecret}`);
    } else {
      envContent += `\nREFRESH_TOKEN_SECRET=${refreshTokenSecret}`;
    }
  
    // Clean up leading/trailing whitespace and write
    fs.writeFile('.env', envContent.trim() + '\n', (writeErr) => {
      if (writeErr) {
        console.error('Error writing to .env file', writeErr);
        return;
      }
      console.log('✅ JWT_SECRET and REFRESH_TOKEN_SECRET have been saved/updated in .env');
    });
});

