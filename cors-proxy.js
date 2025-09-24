const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4201', 'http://localhost:4202'],
  credentials: true
}));

// Proxy API requests to the actual API
app.use('/api', createProxyMiddleware({
  target: 'https://api.gemura.rw',
  changeOrigin: true,
  secure: true,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxying request to:', proxyReq.path);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('Proxy response status:', proxyRes.statusCode);
  }
}));

app.listen(PORT, () => {
  console.log(`CORS proxy server running on http://localhost:${PORT}`);
  console.log('Proxying /api/* requests to https://api.gemura.rw');
});
