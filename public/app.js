const basePath = window.location.pathname.replace(/\/+$/, '');
const apiUrl = (endpoint) => `${basePath}/${endpoint}`;

async function loadData() {
  try {
    const [helloRes, statusRes] = await Promise.all([
      fetch(apiUrl('api/hello')),
      fetch(apiUrl('api/status'))
    ]);
    const hello = await helloRes.json();
    const status = await statusRes.json();

    document.getElementById('message').textContent = hello.message;
    document.getElementById('deployed').textContent = hello.deployedAt;
    document.getElementById('version').textContent = status.version;
    const badge = document.getElementById('status');
    badge.textContent = status.status.toUpperCase();
    badge.style.background = status.status === 'ok' ? '#065f46' : '#7f1d1d';
    badge.style.color = status.status === 'ok' ? '#34d399' : '#f87171';
  } catch (err) {
    document.getElementById('status').textContent = 'ERROR';
    document.getElementById('message').textContent = 'Failed to fetch data';
  }
}

document.getElementById('refreshBtn').addEventListener('click', loadData);
window.addEventListener('DOMContentLoaded', loadData);
