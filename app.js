// LEXAI Mòbil — lògica de l'app
// Dades: importades des d'un CSV generat per LEXAI (Manteniment > Exportar per LEXAI Mòbil).
// Es guarden a localStorage. Cada nova importació REEMPLAÇA totalment les dades anteriors.

const STORAGE_KEY = 'lexaiMobil_dades_v1';
const META_KEY = 'lexaiMobil_meta_v1';

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

function importarCSV(text) {
  const resultat = Papa.parse(text, { header: true, skipEmptyLines: true });
  if (resultat.errors && resultat.errors.length) {
    console.warn('Avisos en parsejar CSV:', resultat.errors);
  }
  const rows = resultat.data
    .filter(r => r.titol && r.titol.trim() !== '')
    .map(r => ({
      id: r.id ? String(r.id) : (r.titol + '|' + r.mes_objectiu),
      titol: r.titol || '',
      autor: r.autor || '',
      bloc: r.bloc || '',
      categoria: r.categoria || '',
      estat: (r.estat || 'pendent').trim(),
      mes_objectiu: r.mes_objectiu || '',
      import_previst: r.import_previst !== '' ? parseFloat(r.import_previst) : null,
      import_real: r.import_real !== '' ? parseFloat(r.import_real) : null,
      data_previsio: r.data_previsio || '',
      data_compra: r.data_compra || '',
      tenda: r.tenda || '',
      marcat: false,
    }));

  if (rows.length === 0) {
    mostrarToast('El CSV no conté cap fila vàlida.');
    return;
  }

  // Reemplaçar TOTALMENT les dades anteriors (comportament acordat)
  state.rows = rows;
  desarDades(rows);
  desarMeta({ data_importacio: new Date().toISOString(), n: rows.length });

  state.mesos = mesosDisponibles(rows);
  // Situar-se al mes actual si hi és, si no al primer disponible
  const mesActual = new Date().toISOString().slice(0, 7);
  const idxActual = state.mesos.indexOf(mesActual);
  state.mesIdx = idxActual >= 0 ? idxActual : 0;

  mostrarToast(`Importades ${rows.length} previsions.`);
  render();
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
    footerInfo.textContent = `${meta.n} previsions · importat ${d.toLocaleDateString('ca')}`;
  } else {
    footerInfo.textContent = 'Cap dada carregada';
  }

  if (!state.rows.length) {
    nav.style.display = 'none';
    main.innerHTML = `
      <div class="buit">
        <div class="icona">📚</div>
        <h2>Encara no tens cap previsió carregada</h2>
        <p>Genera el CSV des de LEXAI (Manteniment → Exportar per LEXAI Mòbil)
           i importa'l aquí per veure les previsions de compra del mes.</p>
        <button class="btn-primari" id="btn-importar-buit">Importar CSV</button>
      </div>`;
    document.getElementById('btn-importar-buit').addEventListener('click', obrirSelectorFitxer);
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
