// Professional icon generator for Cryptexa Wallet
const fs = require('fs');
const path = require('path');

// SVG template for Cryptexa icon
const createSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#764ba2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background rounded rectangle -->
  <rect x="${size * 0.05}" y="${size * 0.05}" width="${size * 0.9}" height="${size * 0.9}" 
        rx="${size * 0.2}" fill="url(#grad)" filter="url(#shadow)"/>
  
  <!-- Wallet icon -->
  <g transform="translate(${size * 0.5}, ${size * 0.5})">
    <!-- Wallet body -->
    <rect x="${-size * 0.25}" y="${-size * 0.15}" width="${size * 0.5}" height="${size * 0.3}" 
          rx="${size * 0.03}" fill="#ffffff" opacity="0.95"/>
    
    <!-- Wallet flap -->
    <rect x="${-size * 0.25}" y="${-size * 0.15}" width="${size * 0.5}" height="${size * 0.08}" 
          fill="#ffffff" opacity="0.7"/>
    
    <!-- Card slot line -->
    <line x1="${-size * 0.15}" y1="${size * 0.02}" x2="${size * 0.15}" y2="${size * 0.02}" 
          stroke="#667eea" stroke-width="${size * 0.015}" stroke-linecap="round"/>
    
    <!-- Shine effect -->
    <circle cx="${-size * 0.12}" cy="${-size * 0.08}" r="${size * 0.04}" 
            fill="#ffffff" opacity="0.4"/>
  </g>
</svg>
`;

// Create icons directory
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG files for each size
[16, 32, 48, 128].forEach(size => {
  const svg = createSVG(size);
  fs.writeFileSync(path.join(iconsDir, `icon${size}.svg`), svg);
  console.log(`✓ Created icon${size}.svg`);
});

console.log('\n✅ All icons generated successfully!');
console.log('\n📝 To convert to PNG:');
console.log('   1. Open each SVG in a browser');
console.log('   2. Take screenshot or use online SVG to PNG converter');
console.log('   3. Or install sharp: npm install sharp');
console.log('   4. Icons are ready in public/icons/');
