const http = require('http');

const options = {
  host: 'localhost',
  port: process.env.PORT || 3000,
  timeout: 3000,
  path: '/',
  method: 'GET',
  headers: {
    'User-Agent': 'Docker-Health-Check'
  }
};

const request = http.request(options, (res) => {
  console.log(`Health check STATUS: ${res.statusCode}`);
  
  // Accept both successful responses and redirects
  if (res.statusCode >= 200 && res.statusCode < 400) {
    console.log('✅ Health check passed');
    process.exit(0);
  } else {
    console.log('❌ Health check failed - Bad status code');
    process.exit(1);
  }
});

request.on('error', function(err) {
  console.log('❌ Health check ERROR:', err.message);
  process.exit(1);
});

request.on('timeout', function() {
  console.log('❌ Health check TIMEOUT');
  request.destroy();
  process.exit(1);
});

request.setTimeout(3000);
request.end();
