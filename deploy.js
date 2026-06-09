const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Generate version based on current date/time in local timezone
const now = new Date();
const pad = (n) => String(n).padStart(2, '0');

// Format: v1.0.YYYYMMDD.HHMM
const year = now.getFullYear();
const month = pad(now.getMonth() + 1);
const day = pad(now.getDate());
const hours = pad(now.getHours());
const minutes = pad(now.getMinutes());

const version = `v1.0.${year}${month}${day}.${hours}${minutes}`;

console.log(`\n========================================`);
console.log(`🚀 Preparing Deployment: ${version}`);
console.log(`========================================\n`);

// 1. Update version tag in index.html
const indexPath = path.join(__dirname, 'index.html');
try {
  let indexHtml = fs.readFileSync(indexPath, 'utf8');
  
  // Matches any span tag containing id="app-version"
  const versionRegex = /(<span[^>]*id="app-version"[^>]*>)[^<]*(<\/span>)/g;
  
  if (versionRegex.test(indexHtml)) {
    indexHtml = indexHtml.replace(versionRegex, `$1${version}$2`);
    fs.writeFileSync(indexPath, indexHtml, 'utf8');
    console.log(`✅ Successfully updated index.html to ${version}`);
  } else {
    console.warn('⚠️ Could not find app-version tag placeholder in index.html.');
  }
} catch (err) {
  console.error('❌ Error updating index.html version:', err.message);
  process.exit(1);
}

// 2. Deploy to Firebase
console.log('\n📦 Running firebase deploy...');
try {
  execSync('firebase deploy --only hosting', { stdio: 'inherit' });
  console.log('\n🎉 Deployment Successful!');
  console.log(`🔗 Live App: https://rvboondock.web.app\n`);
} catch (error) {
  console.error('\n❌ Deployment failed:', error.message);
  process.exit(1);
}
