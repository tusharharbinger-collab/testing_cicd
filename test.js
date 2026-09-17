const assert = require('assert');
const app = require('./server');

const server = app.listen(0, async () => {
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;
  try {
    const res = await fetch(`${base}/api/status`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.status, 'ok');

    // Real bug found live: index.html's relative <link href="style.css">/
    // <script src="app.js"> only resolve correctly when the current URL
    // ends in "/" — a real visit to a path prefix without a trailing
    // slash (e.g. behind the platform's shared ALB) served a completely
    // unstyled page with no working JS, since the browser resolved both
    // against the parent path instead. A redirect that adds the trailing
    // slash must fire for any nested prefix path, not just the bare root.
    const noSlashRes = await fetch(`${base}/api/v1/some-project`, { redirect: 'manual' });
    assert.strictEqual(noSlashRes.status, 302);
    assert.strictEqual(noSlashRes.headers.get('location'), '/api/v1/some-project/');

    // A path that already ends in "/" must serve the real page, not redirect again.
    const withSlashRes = await fetch(`${base}/api/v1/some-project/`, { redirect: 'manual' });
    assert.strictEqual(withSlashRes.status, 200);

    // Real API/asset routes must never be redirected — only the page itself.
    const helloRes = await fetch(`${base}/api/v1/some-project/api/hello`, { redirect: 'manual' });
    assert.strictEqual(helloRes.status, 200);

    console.log('✔ All tests passed');
    server.close();
  } catch (err) {
    console.error('Test failed:', err);
    server.close(() => process.exit(1));
  }
});
