#!/usr/bin/env node

const { spawn } = require('child_process');
const os = require('os');

// Get the external IP address
function getExternalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Get the port from environment or default to 4444
const port = process.env.PORT || 4444;
const externalIP = getExternalIP();

console.log('   ▲ Next.js 15.5.0');
console.log(`   - Local:        http://localhost:${port}`);
console.log(`   - Network:      http://${externalIP}:${port}`);
console.log('');

// Start the standalone server
const server = spawn('node', ['.next/standalone/server.js'], {
  env: {
    ...process.env,
    PORT: port,
    HOSTNAME: '0.0.0.0'
  },
  stdio: 'inherit'
});

server.on('close', (code) => {
  process.exit(code);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
