const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const APP_VERSION = process.env.APP_VERSION || 'v2';
const deployedAt = new Date().toISOString();

app.get('*', (req, res) => {
  const segment = req.path.split('/').filter(Boolean).pop();

  if (segment === 'hello') {
    return res.json({ message: `Hello from ${APP_VERSION}`, deployedAt });
  }
  if (segment === 'status') {
    return res.json({ status: 'ok', version: APP_VERSION });
  }
  if (segment === 'style.css') {
    return res.sendFile(path.join(__dirname, 'public', 'style.css'));
  }
  if (segment === 'app.js') {
    return res.sendFile(path.join(__dirname, 'public', 'app.js'));
  }

  // Falling through to serve index.html, whose own <link>/<script> tags use
  // relative paths ("style.css", "app.js") on purpose, so they work no
  // matter what path prefix this instance is deployed under. But a browser
  // only resolves those correctly if the current URL ends in "/" (treating
  // the last segment as a folder) — without it, the browser resolves them
  // against the PARENT path instead, and both 404 even though the page
  // itself loaded. Confirmed live behind the platform's shared ALB: a
  // bookmark or manual visit to the bare path (no trailing slash) served a
  // completely unstyled page with no working JS. Redirecting to add the
  // trailing slash fixes every future visit — no need to know or hardcode
  // the actual prefix, since this just re-requests the exact same path
  // with "/" appended.
  if (!req.path.endsWith('/')) {
    return res.redirect(req.path + '/');
  }
  return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on 0.0.0.0:${PORT} (${APP_VERSION})`);
  });
}

module.exports = app;

