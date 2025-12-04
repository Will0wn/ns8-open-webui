function qs() {
  const p = new URLSearchParams(location.search);
  const q = p.get('q') ? new URLSearchParams(p.get('q')) : new URLSearchParams();
  return { page: q.get('page') || 'status' };
}

async function coreFetch(path, options) {
  try {
    const base = window.parent?.ns8Core?.config?.API_ENDPOINT || '/cluster-admin/api';
    const res = await fetch(`${base}${path}`, { credentials: 'include', ...options });
    return res.json();
  } catch (e) {
    return { error: String(e) };
  }
}

async function getConfiguration(moduleId) {
  return coreFetch(`/tasks/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agent: `module/${moduleId}`, action: 'get-configuration', extra: { isNotificationHidden: true } })
  });
}

function renderStatus(root, cfg, moduleId) {
  root.innerHTML = `
    <section>
      <h3>Stato</h3>
      <p>Istanza: ${moduleId}</p>
      <p>Porta: ${cfg.port || ''}</p>
      <button id="open-app">Apri app</button>
    </section>
  `;
  document.getElementById('open-app').onclick = () => {
    const host = cfg.host || '';
    if (host) {
      window.open(`https://${host}/`, '_blank');
    } else if (cfg.port) {
      // fallback locale
      window.open(`http://127.0.0.1:${cfg.port}/`, '_blank');
    }
  };
}

function renderSettings(root, cfg, moduleId) {
  root.innerHTML = `
    <section>
      <h3>Impostazioni</h3>
      <label>Host</label>
      <input id="host" placeholder="openwebui.mydomain" value="${cfg.host || ''}" />
      <label><input type="checkbox" id="http2https" ${cfg.http2https ? 'checked' : ''}/> Reindirizza HTTP→HTTPS</label>
      <label><input type="checkbox" id="lets_encrypt" ${cfg.lets_encrypt ? 'checked' : ''}/> Let's Encrypt</label>
      <button id="save">Salva</button>
    </section>
  `;
  document.getElementById('save').onclick = async () => {
    const payload = {
      host: document.getElementById('host').value.trim(),
      http2https: document.getElementById('http2https').checked,
      lets_encrypt: document.getElementById('lets_encrypt').checked
    };
    await coreFetch(`/tasks/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent: `module/${moduleId}`, action: 'configure-module', data: payload })
    });
    location.reload();
  };
}

function renderAbout(root) {
  root.innerHTML = `
    <section>
      <h3>Informazioni</h3>
      <p>Open WebUI integrato in NS8.</p>
    </section>
  `;
}

async function main() {
  const moduleId = new URLSearchParams(location.search).get('module');
  const q = qs();
  const root = document.getElementById('app');
  const cfg = await getConfiguration(moduleId);

  if (q.page === 'settings') return renderSettings(root, cfg, moduleId);
  if (q.page === 'about') return renderAbout(root);
  return renderStatus(root, cfg, moduleId);
}

main();

