const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3001;

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse the target URL
  const targetUrl = 'https://api.gemura.rw' + req.url;
  console.log('Proxying request to:', targetUrl);

  // Make the request to the target server
  const options = {
    hostname: 'api.gemura.rw',
    port: 443,
    path: req.url,
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  const proxyReq = https.request(options, (proxyRes) => {
    // Set CORS headers on the response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy request error:', err);
    res.writeHead(500);
    res.end('Proxy error: ' + err.message);
  });

  // Forward the request body
  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log(`Simple proxy server running on http://localhost:${PORT}`);
  console.log('Proxying requests to https://api.gemura.rw');
});
