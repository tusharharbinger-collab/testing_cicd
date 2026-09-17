const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const APP_VERSION = process.env.APP_VERSION || 'v1';
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
  return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on 0.0.0.0:${PORT} (${APP_VERSION})`);
  });
}

module.exports = app;

