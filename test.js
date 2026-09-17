const assert = require('assert');
const app = require('./server');

const server = app.listen(0, async () => {
  const { port } = server.address();
  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/status`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.status, 'ok');
    console.log('✔ All tests passed');
    server.close();
  } catch (err) {
    console.error('Test failed:', err);
    server.close(() => process.exit(1));
  }
});
