// LEXAI Mòbil — lògica de l'app
// Dades: importades des d'un CSV generat per LEXAI (Manteniment > Exportar per LEXAI Mòbil).
// Es guarden a localStorage. Cada nova importació REEMPLAÇA totalment les dades anteriors.

const STORAGE_KEY = 'lexaiMobil_dades_v1';
const META_KEY = 'lexaiMobil_meta_v1';
const GITHUB_URL_KEY = 'lexaiMobil_github_url_v1';
const GITHUB_URL_DEFECTE = 'https://raw.githubusercontent.com/rbatalla/lexai-mobil/main/data/lexai_mobil_current_data.json';

const MESOS_CA = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny',
                   'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];

const ESTAT_ORDRE = ['pendent', 'transit', 'comprat'];
const ESTAT_LABEL = { pendent: 'Pendents', transit: 'En trànsit', comprat: 'Comprades' };

let state = {
  rows: [],
  mesos: [],      // llista ordenada de 'YYYY-MM' presents a les dades
  mesIdx: 0,
};

// ── Persistència ──────────────────────────────────────────────────────────

function carregarDades() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error llegint dades locals:', e);
    return [];
  }
}

function desarDades(rows) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  } catch (e) {
    console.error('Error desant dades locals:', e);
    mostrarToast('No s\'han pogut desar les dades al mòbil (espai insuficient?).');
  }
}

function carregarMeta() {
  try {
    const raw = localStorage.getItem(META_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function desarMeta(meta) {
  try { localStorage.setItem(META_KEY, JSON.stringify(meta)); } catch (e) {}
}

function obtenirUrlGithub() {
  return localStorage.getItem(GITHUB_URL_KEY) || GITHUB_URL_DEFECTE;
}

function configurarUrlGithub() {
  const actual = obtenirUrlGithub();
  const nova = window.prompt(
    "Adreça del fitxer JSON a GitHub (raw):",
    actual
  );
  if (nova === null) return; // cancel·lat
  const neta = nova.trim();
  if (!neta) return;
  localStorage.setItem(GITHUB_URL_KEY, neta);
  mostrarToast('Adreça de GitHub desada.');
}

// ── Utilitats ─────────────────────────────────────────────────────────────

function mesosDisponibles(rows) {
  const set = new Set(rows.map(r => r.mes_objectiu).filter(Boolean));
  return Array.from(set).sort();
}

function formatMes(mesStr) {
  if (!mesStr) return '—';
  const [any, mes] = mesStr.split('-').map(Number);
  const nom = MESOS_CA[mes - 1] || mesStr;
  return { text: nom, any };
}

function formatPreu(v) {
  if (v === null || v === undefined || v === '' || isNaN(v)) return null;
  return Number(v).toFixed(2).replace('.', ',') + ' €';
}

function formatData(d) {
  if (!d) return null;
  const parts = String(d).split('-');
  if (parts.length !== 3) return d;
  return `${parts[2]}/${parts[1]}/${parts[0].slice(2)}`;
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

let toastTimer = null;
function mostrarToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('oculta');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('oculta'), 3200);
}

// ── Importació CSV ────────────────────────────────────────────────────────

function normalitzarFiles(rawRows) {
  return rawRows
    .filter(r => r.titol && String(r.titol).trim() !== '')
    .map(r => ({
      id: r.id !== undefined && r.id !== null ? String(r.id) : (r.titol + '|' + r.mes_objectiu),
      titol: r.titol || '',
      autor: r.autor || '',
      bloc: r.bloc || '',
      categoria: r.categoria || '',
      estat: (r.estat || 'pendent').trim(),
      mes_objectiu: r.mes_objectiu || '',
      import_previst: (r.import_previst !== '' && r.import_previst !== null && r.import_previst !== undefined)
        ? parseFloat(r.import_previst) : null,
      import_real: (r.import_real !== '' && r.import_real !== null && r.import_real !== undefined)
        ? parseFloat(r.import_real) : null,
      data_previsio: r.data_previsio || '',
      data_compra: r.data_compra || '',
      tenda: r.tenda || '',
      marcat: false,
    }));
}

function aplicarNovesDades(rows, meta) {
  if (rows.length === 0) {
    mostrarToast('No hi ha cap previsió vàlida per carregar.');
    return;
  }
  // Reemplaçar TOTALMENT les dades anteriors (comportament acordat)
  state.rows = rows;
  desarDades(rows);
  desarMeta(meta);

  state.mesos = mesosDisponibles(rows);
  const mesActual = new Date().toISOString().slice(0, 7);
  const idxActual = state.mesos.indexOf(mesActual);
  state.mesIdx = idxActual >= 0 ? idxActual : 0;

  render();
}

function importarCSV(text) {
  const resultat = Papa.parse(text, { header: true, skipEmptyLines: true });
  if (resultat.errors && resultat.errors.length) {
    console.warn('Avisos en parsejar CSV:', resultat.errors);
  }
  const rows = normalitzarFiles(resultat.data);
  mostrarToast(rows.length ? `Importades ${rows.length} previsions.` : 'El CSV no conté cap fila vàlida.');
  aplicarNovesDades(rows, {
    font: 'csv',
    data_importacio: new Date().toISOString(),
    n: rows.length,
  });
}

async function actualitzarDesDeGithub() {
  const url = obtenirUrlGithub();
  mostrarToast('Descarregant des de GitHub...');
  let dades;
  try {
    const resp = await fetch(url, { cache: 'no-store' });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    dades = await resp.json();
  } catch (e) {
    console.error('Error descarregant de GitHub:', e);
    mostrarToast('No s\'ha pogut descarregar el fitxer. Comprova l\'adreça i la connexió.');
    return;
  }

  const previsions = Array.isArray(dades.previsions) ? dades.previsions : [];
  const rows = normalitzarFiles(previsions);
  mostrarToast(rows.length ? `Actualitzades ${rows.length} previsions des de GitHub.` : 'El fitxer no conté cap previsió.');
  aplicarNovesDades(rows, {
    font: 'github',
    data_importacio: new Date().toISOString(),
    generat_el: dades.generat_el || null,
    n: rows.length,
  });
}

// ── Marcatge local ("el tinc a la mà") ─────────────────────────────────────

function toggleMarcat(id) {
  const r = state.rows.find(x => x.id === id);
  if (!r) return;
  r.marcat = !r.marcat;
  desarDades(state.rows);
  render();
}

// ── Renderització ─────────────────────────────────────────────────────────

function render() {
  const main = document.getElementById('main');
  const nav = document.getElementById('mes-nav');
  const footerInfo = document.getElementById('footer-info');
  const meta = carregarMeta();

  if (meta) {
    const d = new Date(meta.data_importacio);
    if (meta.font === 'github' && meta.generat_el) {
      const g = new Date(meta.generat_el);
      footerInfo.textContent = `${meta.n} previsions · generat ${g.toLocaleString('ca')}`;
    } else {
      footerInfo.textContent = `${meta.n} previsions · importat ${d.toLocaleDateString('ca')}`;
    }
  } else {
    footerInfo.textContent = 'Cap dada carregada';
  }

  if (!state.rows.length) {
    nav.style.display = 'none';
    main.innerHTML = `
      <div class="buit">
        <div class="icona">📚</div>
        <h2>Encara no tens cap previsió carregada</h2>
        <p>Importa el CSV generat des de LEXAI (Manteniment → Exportar per LEXAI Mòbil),
           o actualitza directament des de GitHub si ja tens la sincronització configurada.</p>
        <button class="btn-primari" id="btn-importar-buit">Importar CSV</button>
        <div style="height:10px;"></div>
        <button class="btn-marcar" id="btn-github-buit">🔄 Actualitzar des de GitHub</button>
      </div>`;
    document.getElementById('btn-importar-buit').addEventListener('click', obrirSelectorFitxer);
    document.getElementById('btn-github-buit').addEventListener('click', actualitzarDesDeGithub);
    return;
  }

  nav.style.display = 'flex';
  const mesActual = state.mesos[state.mesIdx];
  const { text, any } = formatMes(mesActual);
  document.getElementById('mes-label').innerHTML = `${text} <small>${any}</small>`;
  document.getElementById('btn-mes-ant').disabled = state.mesIdx <= 0;
  document.getElementById('btn-mes-seg').disabled = state.mesIdx >= state.mesos.length - 1;

  const rowsDelMes = state.rows.filter(r => r.mes_objectiu === mesActual);

  let html = '';
  for (const estat of ESTAT_ORDRE) {
    const grup = rowsDelMes.filter(r => r.estat === estat);
    if (!grup.length) continue;
    html += `<div class="seccio-titol ${estat}">${ESTAT_LABEL[estat]}
               <span class="comptador">${grup.length}</span></div>`;
    for (const r of grup) {
      html += renderCard(r);
    }
  }

  if (!html) {
    html = `<div class="buit" style="padding:40px 24px;">
              <div class="icona">🗓️</div>
              <p>No hi ha cap previsió aquest mes.</p>
            </div>`;
  }

  main.innerHTML = html;

  main.querySelectorAll('[data-toggle-id]').forEach(btn => {
    btn.addEventListener('click', () => toggleMarcat(btn.getAttribute('data-toggle-id')));
  });
}

function renderCard(r) {
  let iconaCat = '';
  if (r.categoria === 'impulsiu') {
    iconaCat = '<span class="card-icona-cat impulsiu" title="Compra impulsiva: no prevista">⚡</span>';
  } else if (r.categoria === 'inesperat') {
    iconaCat = '<span class="card-icona-cat inesperat" title="Inesperat: no era del pla original">↪</span>';
  }

  const pills = [];
  if (r.bloc) pills.push(`<span class="pill">${escapeHtml(r.bloc)}</span>`);

  const preuReal = formatPreu(r.import_real);
  const preuPrevist = formatPreu(r.import_previst);
  if (r.estat === 'comprat' && preuReal) {
    pills.push(`<span class="pill preu real">${preuReal}</span>`);
  } else if (preuPrevist) {
    pills.push(`<span class="pill preu">≈ ${preuPrevist}</span>`);
  }

  if (r.tenda) pills.push(`<span class="pill tenda">🏬 ${escapeHtml(r.tenda)}</span>`);

  const data = r.estat === 'comprat' ? formatData(r.data_compra) : formatData(r.data_previsio);
  if (data) pills.push(`<span class="pill data">📅 ${data}</span>`);

  const marcatCard = r.marcat ? ' marcat' : '';
  const mostraToggle = r.estat !== 'comprat';
  const btnToggle = mostraToggle ? `
    <div class="card-bottom">
      <button class="btn-marcar${r.marcat ? ' actiu' : ''}" data-toggle-id="${escapeHtml(r.id)}">
        ${r.marcat ? '✓ El tinc a la mà' : '🛒 Marcar (a la botiga)'}
      </button>
    </div>` : '';

  return `
    <div class="card-llibre${marcatCard}">
      <div class="card-top">
        <div>
          <div class="card-titol">${escapeHtml(r.titol)}</div>
          ${r.autor ? `<div class="card-autor">${escapeHtml(r.autor)}</div>` : ''}
        </div>
        ${iconaCat}
      </div>
      <div class="card-meta">${pills.join('')}</div>
      ${btnToggle}
    </div>`;
}

// ── Navegació de mesos ──────────────────────────────────────────────────

function mesAnterior() {
  if (state.mesIdx > 0) { state.mesIdx--; render(); }
}
function mesSeguent() {
  if (state.mesIdx < state.mesos.length - 1) { state.mesIdx++; render(); }
}

// ── Selector de fitxer ────────────────────────────────────────────────────

function obrirSelectorFitxer() {
  document.getElementById('input-csv').click();
}

async function forcarActualitzacio() {
  mostrarToast('Actualitzant... un moment.');
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) await reg.unregister();
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      for (const k of keys) await caches.delete(k);
    }
  } catch (e) {
    console.warn('Error forçant actualització:', e);
  }
  // Recàrrega forçada des del servidor, ignorant qualsevol cosa guardada
  window.location.reload();
}

function onFitxerSeleccionat(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => importarCSV(e.target.result);
  reader.onerror = () => mostrarToast('No s\'ha pogut llegir el fitxer.');
  reader.readAsText(file, 'UTF-8');
  ev.target.value = ''; // permetre re-seleccionar el mateix fitxer
}

// ── Inicialització ────────────────────────────────────────────────────────

function init() {
  state.rows = carregarDades();
  state.mesos = mesosDisponibles(state.rows);
  const mesActual = new Date().toISOString().slice(0, 7);
  const idxActual = state.mesos.indexOf(mesActual);
  state.mesIdx = idxActual >= 0 ? idxActual : 0;

  document.getElementById('btn-importar').addEventListener('click', obrirSelectorFitxer);
  document.getElementById('btn-importar-2').addEventListener('click', obrirSelectorFitxer);
  document.getElementById('btn-github-2').addEventListener('click', actualitzarDesDeGithub);
  document.getElementById('btn-forcar-update').addEventListener('click', forcarActualitzacio);
  document.getElementById('btn-config-github').addEventListener('click', configurarUrlGithub);
  document.getElementById('input-csv').addEventListener('change', onFitxerSeleccionat);
  document.getElementById('btn-mes-ant').addEventListener('click', mesAnterior);
  document.getElementById('btn-mes-seg').addEventListener('click', mesSeguent);

  render();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch((e) => {
      console.warn('Service worker no registrat:', e);
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
