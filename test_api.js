const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data.slice(0, 200) // chỉ lấy 200 ký tự đầu
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function testAll() {
  const apis = [
    'http://localhost:3000/api/tonkho/summary',
    'http://localhost:3000/api/bien-dong-ton-kho',
    'http://localhost:3000/api/canh-bao-ton-kho',
    'http://localhost:3000/api/kiemke/dot',
    'http://localhost:3000/api/mathang'
  ];

  for (const api of apis) {
    try {
      console.log(`Requesting ${api}...`);
      const start = Date.now();
      const res = await get(api);
      console.log(`Response: status=${res.status}, time=${Date.now() - start}ms`);
      console.log(`Data preview: ${res.data}\n`);
    } catch (err) {
      console.error(`Request to ${api} failed: ${err.message}\n`);
    }
  }
}

testAll();
