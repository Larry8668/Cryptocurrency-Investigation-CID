const { exec } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env.development.local') });

const devMode = process.env.VITE_VERCEL_DEV_MODE === 'ON';

if (devMode) {
  console.log("DevMODE ON");
  exec('npm run dev:both', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${stderr}`);
      return;
    }
    console.log(stdout);
  });
} else {
  console.log("DevMODE OFF");
  exec('npm run dev', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${stderr}`);
      return;
    }
    console.log(stdout);
  });
}