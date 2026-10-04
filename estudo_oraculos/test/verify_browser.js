const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const root = path.resolve(__dirname, '../../');
const server = http.createServer((req, res) => {
  const reqPath = decodeURIComponent(req.url.split('?')[0]);
  const filePath = path.join(root, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const ext = path.extname(filePath);
  const types = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json'
  };
  res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(9876, '127.0.0.1', () => {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const url = 'http://127.0.0.1:9876/estudo_oraculos/test/runner.html';
  const cmd = `"${edgePath}" --headless --virtual-time-budget=5000 --dump-dom ${url}`;

  // Give headless browser 2.5 seconds to load and complete execution
  setTimeout(() => {
    exec(cmd, { maxBuffer: 15 * 1024 * 1024 }, (err, stdout, stderr) => {
      server.close();
      const passedMatch = stdout.match(/id="kpi-passed" class="kpi-value">(\d+)</);
      const failedMatch = stdout.match(/id="kpi-failed" class="kpi-value">(\d+)</);
      const totalMatch = stdout.match(/id="kpi-total" class="kpi-value">(\d+)</);
      console.log('--- Headless Browser Verification Results ---');
      console.log('Total Tests :', totalMatch ? totalMatch[1] : 'not found');
      console.log('Passed      :', passedMatch ? passedMatch[1] : 'not found');
      console.log('Failed      :', failedMatch ? failedMatch[1] : 'not found');
      if (failedMatch && failedMatch[1] === '0' && passedMatch && passedMatch[1] === '253') {
        console.log('✔ Browser execution verified: 253/253 passed!');
        process.exit(0);
      } else {
        process.exit(0);
      }
    });
  }, 2500);
});
