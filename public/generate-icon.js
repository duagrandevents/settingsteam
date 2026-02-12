const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a 512x512 canvas
const canvas = createCanvas(512, 512);
const ctx = canvas.getContext('2d');

// Create gradient background
const gradient = ctx.createLinearGradient(0, 0, 512, 512);
gradient.addColorStop(0, '#0f172a');
gradient.addColorStop(0.5, '#1e3a8a');
gradient.addColorStop(1, '#6366f1');

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 512, 512);

// Add subtle geometric pattern
ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
ctx.lineWidth = 2;

// Draw grid pattern
for (let i = 0; i < 512; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
}

// Add circular accent
ctx.beginPath();
ctx.arc(256, 256, 180, 0, Math.PI * 2);
ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
ctx.lineWidth = 3;
ctx.stroke();

ctx.beginPath();
ctx.arc(256, 256, 140, 0, Math.PI * 2);
ctx.stroke();

// Draw text "DUA SETTINGS"
ctx.fillStyle = '#ffffff';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Add subtle shadow/glow effect to text
ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
ctx.shadowBlur = 20;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 0;

// First line: "DUA"
ctx.font = 'bold 72px sans-serif';
ctx.fillText('DUA', 256, 220);

// Second line: "SETTINGS"
ctx.font = 'bold 56px sans-serif';
ctx.fillText('SETTINGS', 256, 300);

// Save as JPG
const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
fs.writeFileSync(__dirname + '/logo.jpg', buffer);

console.log('Icon generated successfully: logo.jpg');
