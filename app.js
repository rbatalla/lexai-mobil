// LEXAI Mòbil — lògica de l'app
// Dades: importades des d'un CSV generat per LEXAI (Manteniment > Exportar per LEXAI Mòbil).
// Es guarden a localStorage. Cada nova importació REEMPLAÇA totalment les dades anteriors.

const APP_VERSION = '1.7.2';

// ── Icones planes, un sol color (currentColor), sense emojis ──────────────
const ICONES = {
  bandera: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
  importar: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  config: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
  refrescar: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  forcar: '<polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>',
  calendari: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  botiga: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  carret: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  llibre: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
  piles: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  diana: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2"/>',
  cantonada: '<polyline points="15 10 20 15 15 20"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/>',
  llamp: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  chevronDreta: '<polyline points="9 18 15 12 9 6"/>',
  chevronEsquerra: '<polyline points="15 18 9 12 15 6"/>',
  copa: '<path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M7 4H3v2a4 4 0 0 0 4 4"/><path d="M17 4h4v2a4 4 0 0 1-4 4"/>',
  minimitzar: '<line x1="5" y1="19" x2="19" y2="19"/>',
  pujar: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 8 12 3 17 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  csv: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/>',
  rellotge: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  pausa: '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',
  stop: '<rect x="5" y="5" width="14" height="14" rx="2"/>',
};

function icona(nom, mida) {
  mida = mida || 20;
  return `<svg width="${mida}" height="${mida}" viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
         `stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONES[nom] || ''}</svg>`;
}
const STORAGE_KEY = 'lexaiMobil_dades_v1';
const META_KEY = 'lexaiMobil_meta_v1';
const GITHUB_URL_KEY = 'lexaiMobil_github_url_v1';
const GITHUB_URL_DEFECTE = 'https://raw.githubusercontent.com/rbatalla/lexai-mobil/main/data/lexai_mobil_current_data.json';
const GITHUB_REPO_KEY = 'lexaiMobil_github_repo_v1';
const GITHUB_REPO_DEFECTE = 'rbatalla/lexai-mobil';
const GITHUB_TOKEN_KEY = 'lexaiMobil_github_token_v1';
const POMODORO_PATH = 'data/lexai_mobil_pomodoros_pendents.json';
const POMODORO_CONFIG_KEY = 'lexaiMobil_pomodoro_config_v1';
const POMODORO_PENDENTS_KEY = 'lexaiMobil_pomodoro_pendents_v1';
const POMODORO_COMPTADOR_KEY = 'lexaiMobil_pomodoro_comptador_v1';
const POMODORO_ULTIM_US_KEY = 'lexaiMobil_pomodoro_ultim_us_v1';
const PREVISIONS_NOVES_PATH = 'data/lexai_mobil_previsions_noves.json';
const PREVISIONS_NOVES_KEY = 'lexaiMobil_previsions_noves_v1';
const POMODORO_CONFIG_DEFECTE = {
  durada_treball: 1500, durada_descans: 300, durada_desc_llarg: 900,
  so_activat: true, so_descans: false, so_durada: 5,
};

function obtenirUltimsUsos() {
  try {
    return JSON.parse(localStorage.getItem(POMODORO_ULTIM_US_KEY)) || {};
  } catch (e) { return {}; }
}

function marcarUltimUsLlibre(llibreId) {
  const usos = obtenirUltimsUsos();
  usos[llibreId] = Date.now();
  localStorage.setItem(POMODORO_ULTIM_US_KEY, JSON.stringify(usos));
}

const MESOS_CA = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny',
                   'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];

const ESTAT_ORDRE = ['pendent', 'transit', 'comprat'];
const ESTAT_LABEL = { pendent: 'Pendents', transit: 'En trànsit', comprat: 'Comprades' };

// Blocs de categoria del TBR (mateixos valors que tbr.categoria a LEXAI escriptori:
// 'comic' / 'genere' / 'no_ficcio' / 'mainstream'). Clau '' = sense filtre (Tot).
// 'classics' és transversal (no és un valor de categoria): filtra pel flag
// `es_classic` que ja arriba calculat des de l'escriptori.
const TBR_CATEGORIES = [
  { key: '',           label: 'Tot' },
  { key: 'comic',      label: 'Còmic' },
  { key: 'genere',     label: 'Gènere' },
  { key: 'no_ficcio',  label: 'Assaig' },
  { key: 'mainstream', label: 'Mainstream' },
  { key: 'classics',   label: 'Clàssics' },
];
const TBR_CATEGORIA_LABEL = Object.fromEntries(
  TBR_CATEGORIES.filter(c => c.key).map(c => [c.key, c.label])
);

let state = {
  previsions: [],
  sagues: [],
  tbr: [],
  reptes: null,   // { any, llibres_total:{objectiu,llegits}, categories:[...], comic:{...} }
  llibresEnCurs: [], // [{id, titol, autor, pagines, pagina_actual}]
  mesos: [],      // llista ordenada de 'YYYY-MM' presents a les previsions
  mesIdx: 0,
  mesosTancats: [],  // mesos (YYYY-MM) tancats a l'escriptori
  tab: 'previsions',  // 'previsions' | 'sagues' | 'tbr' | 'reptes' | 'pomodoro'
  tbrFiltreCategoria: '',  // '' = Tot | 'comic' | 'genere' | 'no_ficcio' | 'mainstream'
};

// Categories de Reptes que compten per al comptador de copes (6 en total:
// les 4 de llibres + Còmic + Llibres-total com una copa més del conjunt).
const REPTES_CATEGORIES_COPA = 6;

// ── Wake Lock: evita que la pantalla s'apagui/bloquegi mentre hi ha un
// focus o descans en marxa. Suportat a navegadors moderns (Safari iOS
// 16.4+, Chrome/Android); als que no ho suporten, simplement no fa res
// (no és crític, l'app funciona igual, només cal despertar la pantalla
// manualment de tant en tant).
let _wakeLock = null;

async function _activarWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      _wakeLock = await navigator.wakeLock.request('screen');
      _wakeLock.addEventListener('release', () => { _wakeLock = null; });
    }
  } catch (e) {
    _wakeLock = null; // permís denegat, sense bateria suficient, etc. -- ignorar
  }
}

function _desactivarWakeLock() {
  if (_wakeLock) {
    try { _wakeLock.release(); } catch (e) { /* ja alliberat */ }
    _wakeLock = null;
  }
}

// ── Estat del temporitzador Pomodoro (no persistit; si tanques l'app amb
// un pomodoro en marxa, es perd — igual que passaria si perdessis el mòbil
// de vista un moment; les sessions ja completades sí que estan desades) ──
let pomo = {
  tipus: 'treball',          // 'treball' | 'descans'
  restant: 0,                // segons
  total: 0,                  // segons
  enCurs: false,
  pausat: false,
  cicleNum: 0,                // pomodoros de treball fets en aquest cicle (0-3)
  horaInici: null,
  dataInici: null,
  interval: null,
  esperantConfirmacio: false,  // true just despres d'acabar una fase
  llibreId: null,              // llibre triat (opcional)
  llibreTitol: null,
  paginaInicial: null,
  paginesLlegidesSessio: 0,     // acumulat d'aquesta visita, per ajustar la projecció sense esperar sincronitzar
};

// ── Persistència ──────────────────────────────────────────────────────────

function carregarDades() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { previsions: [], sagues: [], tbr: [], reptes: null, llibresEnCurs: [], mesosTancats: [] };
    const d = JSON.parse(raw);
    return {
      previsions: d.previsions || [],
      sagues: d.sagues || [],
      tbr: d.tbr || [],
      reptes: d.reptes || null,
      llibresEnCurs: d.llibresEnCurs || [],
      mesosTancats: d.mesosTancats || [],
    };
  } catch (e) {
    console.error('Error llegint dades locals:', e);
    return { previsions: [], sagues: [], tbr: [], reptes: null, llibresEnCurs: [], mesosTancats: [] };
  }
}

function desarDades(dades) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dades));
  } catch (e) {
    console.error('Error desant dades locals:', e);
    mostrarToast('No s\'han pogut desar les dades al mòbil (espai insuficient?).');
  }
}

function desarEstatLlibresEnCurs() {
  // Persisteix NOMÉS canvis locals fets sobre state.llibresEnCurs (pàgina
  // actual, pomodoros restants, darrer focus) sense esperar una
  // sincronització completa amb l'escriptori -- si no, es perdien en
  // recarregar l'app i tornava a sortir la pàgina vella.
  const actual = carregarDades();
  actual.llibresEnCurs = state.llibresEnCurs;
  desarDades(actual);
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

// ── Configuració de pujada (repo + token d'escriptura, per als pomodoros) ──

function obtenirRepoGithub() {
  return localStorage.getItem(GITHUB_REPO_KEY) || GITHUB_REPO_DEFECTE;
}

async function pujarPomodorosAra() {
  const token = localStorage.getItem(GITHUB_TOKEN_KEY);
  if (!token) {
    // Sense token encara -- demanem repositori+token abans de poder pujar
    // res; en desar, es reintenta automàticament la pujada.
    configurarPomodoro(() => pujarPomodorosAra());
    return;
  }
  const pendents = obtenirPomodorosPendents();
  if (!pendents.length) {
    mostrarToast('No hi ha cap pomodoro pendent de pujar.');
    return;
  }
  mostrarToast(`Pujant ${pendents.length} pomodoro(s)...`);
  const resultat = await enviarPomodorosPendents();
  const encaraPendents = obtenirPomodorosPendents().length;
  if (!encaraPendents) {
    mostrarToast(`✓ ${pendents.length} pomodoro(s) pujats a GitHub.`);
  } else {
    const motiu = (resultat && resultat.motiu) ? resultat.motiu : 'motiu desconegut';
    mostrarToast(`No s'ha pogut pujar: ${motiu} -- es reintentarà.`);
  }
}

function configurarPomodoro(onDesat) {
  const cfg = obtenirConfigPomodoro();
  const repoActual = obtenirRepoGithub();
  const tokenActual = localStorage.getItem(GITHUB_TOKEN_KEY) || '';

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-caixa modal-config-caixa">
      <div class="modal-titol">Configuració del Pomodoro</div>

      <div class="config-seccio">Durades (minuts)</div>
      <div class="config-fila">
        <label for="cfg-treball">Treball</label>
        <input type="number" id="cfg-treball" min="1" value="${Math.round(cfg.durada_treball / 60)}">
      </div>
      <div class="config-fila">
        <label for="cfg-descans">Descans curt</label>
        <input type="number" id="cfg-descans" min="1" value="${Math.round(cfg.durada_descans / 60)}">
      </div>
      <div class="config-fila">
        <label for="cfg-descans-llarg">Descans llarg (cada 4)</label>
        <input type="number" id="cfg-descans-llarg" min="1" value="${Math.round(cfg.durada_desc_llarg / 60)}">
      </div>

      <div class="config-check-fila">
        <input type="checkbox" id="cfg-so-treball" ${cfg.so_activat ? 'checked' : ''}>
        <label for="cfg-so-treball">So en acabar un treball</label>
      </div>
      <div class="config-check-fila">
        <input type="checkbox" id="cfg-so-descans" ${cfg.so_descans ? 'checked' : ''}>
        <label for="cfg-so-descans">So en acabar un descans</label>
      </div>
      <div class="config-fila">
        <label for="cfg-so-durada">Durada del so (segons)</label>
        <input type="number" id="cfg-so-durada" min="1" max="30" value="${cfg.so_durada}">
      </div>

      <div class="config-seccio">Sincronització amb GitHub</div>
      <div class="config-fila config-fila-text">
        <label for="cfg-repo">Repositori</label>
        <input type="text" id="cfg-repo" value="${escapeHtml(repoActual)}" placeholder="usuari/repositori">
      </div>
      <div class="config-fila config-fila-text">
        <label for="cfg-token">Token d'escriptura</label>
        <input type="password" id="cfg-token" value="${escapeHtml(tokenActual)}" placeholder="ghp_...">
      </div>

      <button type="button" id="cfg-desar">Desar</button>
    </div>`;
  document.body.appendChild(overlay);

  overlay.querySelector('#cfg-desar').addEventListener('click', () => {
    const nt = parseInt(overlay.querySelector('#cfg-treball').value, 10);
    const nd = parseInt(overlay.querySelector('#cfg-descans').value, 10);
    const ndl = parseInt(overlay.querySelector('#cfg-descans-llarg').value, 10);
    if (nt > 0) cfg.durada_treball = nt * 60;
    if (nd > 0) cfg.durada_descans = nd * 60;
    if (ndl > 0) cfg.durada_desc_llarg = ndl * 60;
    cfg.so_activat = overlay.querySelector('#cfg-so-treball').checked;
    cfg.so_descans = overlay.querySelector('#cfg-so-descans').checked;
    const nsd = parseInt(overlay.querySelector('#cfg-so-durada').value, 10);
    if (nsd > 0) cfg.so_durada = Math.min(nsd, 30);
    desarConfigPomodoro(cfg);

    const repoNou = overlay.querySelector('#cfg-repo').value.trim();
    if (repoNou) localStorage.setItem(GITHUB_REPO_KEY, repoNou);
    const tokenNou = overlay.querySelector('#cfg-token').value.trim();
    if (tokenNou) localStorage.setItem(GITHUB_TOKEN_KEY, tokenNou);

    document.body.removeChild(overlay);
    mostrarToast('Configuració desada.');
    if (!pomo.enCurs) renderPomodoro();
    if (typeof onDesat === 'function') onDesat();
  });
}

// ── Configuració i cua de pomodoros ─────────────────────────────────────

function obtenirConfigPomodoro() {
  try {
    const raw = localStorage.getItem(POMODORO_CONFIG_KEY);
    return raw ? { ...POMODORO_CONFIG_DEFECTE, ...JSON.parse(raw) } : { ...POMODORO_CONFIG_DEFECTE };
  } catch (e) { return { ...POMODORO_CONFIG_DEFECTE }; }
}
function desarConfigPomodoro(cfg) {
  localStorage.setItem(POMODORO_CONFIG_KEY, JSON.stringify(cfg));
}
function obtenirPomodorosPendents() {
  try {
    const raw = localStorage.getItem(POMODORO_PENDENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}
function afegirPomodoroPendent(sessio) {
  const pendents = obtenirPomodorosPendents();
  pendents.push(sessio);
  localStorage.setItem(POMODORO_PENDENTS_KEY, JSON.stringify(pendents));
}

// Mateixos valors interns que a LEXAI escriptori (vista_economia.py /
// database.py) -- Bloc=tipus_contable, Motiu=categoria, Demanda i Afectació.
const BLOCS_PREVISIO = [[1, 'Gènere'], [2, 'Còmic'], [3, 'Mainstream'], [4, 'No Ficció']];
const CATEGORIES_PREVISIO = [
  ['inesperat', 'Inesperat'], ['planificat', 'Planificat'], ['impulsiu', 'Impulsiu'],
  ['opcional', 'Opcional'], ['backlog', 'Backlog'],
];
const DEMANDA_PREVISIO = [
  ['opcional', 'Opcional'], ['imprescindible', 'Imprescindible'], ['obligat', 'Obligat'],
  ['interes', 'Interès'], ['movible', 'Movible'], ['revisable', 'Revisable'], ['evitable', 'Evitable'],
];
const AFECTACIO_PREVISIO = [
  ['coleccio', 'Col·lecció'], ['Descatalogat', 'Descatalogat'], ['Renovacio', 'Renovació'],
];

function obrirFormNovaPrevisio(mes) {
  const { text: mesTxt, any: mesAny } = formatMes(mes);
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-caixa modal-nova-previsio-caixa">
      <div class="modal-titol">Nova previsió · ${mesTxt} ${mesAny}</div>

      <div class="config-fila-text">
        <label for="np-titol">Títol *</label>
        <input type="text" id="np-titol" placeholder="Títol del llibre">
      </div>
      <div class="config-fila-text">
        <label for="np-autor">Autor</label>
        <input type="text" id="np-autor" placeholder="Autor">
      </div>
      <div class="config-fila-text">
        <label for="np-editorial">Editorial</label>
        <input type="text" id="np-editorial" placeholder="Editorial">
      </div>

      <div class="config-seccio">Classificació</div>
      <div class="config-fila-text">
        <label for="np-bloc">Bloc</label>
        <select id="np-bloc">${BLOCS_PREVISIO.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select>
      </div>
      <div class="config-fila-text">
        <label for="np-motiu">Motiu</label>
        <select id="np-motiu">${CATEGORIES_PREVISIO.map(([v, l]) => `<option value="${v}"${v === 'inesperat' ? ' selected' : ''}>${l}</option>`).join('')}</select>
      </div>
      <div class="config-fila-text">
        <label for="np-demanda">Demanda</label>
        <select id="np-demanda">${DEMANDA_PREVISIO.map(([v, l]) => `<option value="${v}"${v === 'opcional' ? ' selected' : ''}>${l}</option>`).join('')}</select>
      </div>
      <div class="config-fila-text">
        <label for="np-afectacio">Afectació</label>
        <select id="np-afectacio">${AFECTACIO_PREVISIO.map(([v, l]) => `<option value="${v}"${v === 'coleccio' ? ' selected' : ''}>${l}</option>`).join('')}</select>
      </div>

      <div class="config-seccio">Economia i dates</div>
      <div class="config-fila-text">
        <label for="np-preu">Preu estimat (€)</label>
        <input type="number" id="np-preu" min="0" step="0.01" placeholder="0.00">
      </div>
      <div class="config-fila-text">
        <label for="np-data-edicio">Data d'edició aprox.</label>
        <input type="date" id="np-data-edicio">
      </div>
      <div class="config-fila-text">
        <label for="np-data-comanda">Data de Comanda</label>
        <input type="date" id="np-data-comanda">
      </div>
      <div class="config-check-fila">
        <input type="checkbox" id="np-disponible">
        <label for="np-disponible">Ja disponible</label>
      </div>

      <button type="button" id="np-desar">Afegir previsió</button>
      <button type="button" id="np-cancelar">Cancel·lar</button>
    </div>`;
  document.body.appendChild(overlay);

  overlay.querySelector('#np-cancelar').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });

  overlay.querySelector('#np-desar').addEventListener('click', () => {
    const inpTitol = overlay.querySelector('#np-titol');
    const titol = inpTitol.value.trim();
    if (!titol) {
      inpTitol.style.borderColor = '#E74C3C';
      inpTitol.focus();
      return;
    }
    const blocId = parseInt(overlay.querySelector('#np-bloc').value, 10);
    const blocLabel = (BLOCS_PREVISIO.find(([v]) => v === blocId) || [null, ''])[1];
    const preuVal = parseFloat(overlay.querySelector('#np-preu').value);
    const clientId = `mob-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const nova = {
      client_id: clientId,
      titol,
      autor: overlay.querySelector('#np-autor').value.trim() || null,
      editorial: overlay.querySelector('#np-editorial').value.trim() || null,
      contable_id: blocId,
      categoria: overlay.querySelector('#np-motiu').value,
      demanda: overlay.querySelector('#np-demanda').value,
      afectacio: overlay.querySelector('#np-afectacio').value,
      mes_objectiu: mes,
      estat: 'pendent',
      import_previst: isNaN(preuVal) ? null : preuVal,
      data_edicio_aprox: overlay.querySelector('#np-data-edicio').value || null,
      data_sortida_prevista: overlay.querySelector('#np-data-comanda').value || null,
      ja_disponible: overlay.querySelector('#np-disponible').checked,
      creat_el: new Date().toISOString(),
    };

    // Actualització optimista amb la mateixa forma que normalitzarFiles(),
    // perquè es vegi i es comporti igual que una fila ja sincronitzada.
    state.previsions.push({
      id: clientId,
      titol: nova.titol,
      autor: nova.autor || '',
      bloc: blocLabel,
      categoria: nova.categoria,
      estat: 'pendent',
      mes_objectiu: nova.mes_objectiu,
      import_previst: nova.import_previst,
      import_real: null,
      data_previsio: nova.data_sortida_prevista || '',
      data_compra: '',
      tenda: '',
      marcat: false,
    });
    desarDades({
      previsions: state.previsions, sagues: state.sagues, tbr: state.tbr,
      reptes: state.reptes, llibresEnCurs: state.llibresEnCurs,
      mesosTancats: state.mesosTancats,
    });

    afegirPrevisioNovaPendent(nova);
    enviarPrevisionsNovesPendents(); // best-effort, no bloqueja

    document.body.removeChild(overlay);
    mostrarToast("✓ Previsió afegida (es sincronitzarà amb l'escriptori).");
    renderPrevisions();
  });
}

function obtenirPrevisionsNovesPendents() {
  try {
    const raw = localStorage.getItem(PREVISIONS_NOVES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}
function afegirPrevisioNovaPendent(prev) {
  const pendents = obtenirPrevisionsNovesPendents();
  pendents.push(prev);
  localStorage.setItem(PREVISIONS_NOVES_KEY, JSON.stringify(pendents));
}

async function enviarPrevisionsNovesPendents() {
  const pendents = obtenirPrevisionsNovesPendents();
  if (!pendents.length) return { ok: true };
  const token = localStorage.getItem(GITHUB_TOKEN_KEY);
  if (!token) return { ok: false, motiu: 'sense token configurat' };
  const repo = obtenirRepoGithub();
  const url = `https://api.github.com/repos/${repo}/contents/${PREVISIONS_NOVES_PATH}`;
  try {
    let sha = null;
    let remots = [];
    const getResp = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
    });
    if (getResp.ok) {
      const meta = await getResp.json();
      sha = meta.sha;
      if (meta.content) {
        try {
          const decodificat = decodeURIComponent(escape(atob(meta.content.replace(/\n/g, ''))));
          const parsed = JSON.parse(decodificat);
          if (Array.isArray(parsed)) remots = parsed;
        } catch (e) { /* contingut il·legible -> es continua només amb els locals */ }
      }
    } else if (getResp.status !== 404) {
      return { ok: false, motiu: `error llegint el fitxer (HTTP ${getResp.status})` };
    }

    // Fusió per client_id (identificador generat al mòbil en crear la
    // previsió), mateix criteri que amb els pomodoros pendents.
    const clausRemots = new Set(remots.map(p => p.client_id));
    const unio = remots.concat(pendents.filter(p => !clausRemots.has(p.client_id)));

    const contingut = btoa(unescape(encodeURIComponent(JSON.stringify(unio))));
    const body = { message: 'LEXAI Mòbil: previsions noves', content: contingut };
    if (sha) body.sha = sha;
    const putResp = await fetch(url, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (putResp.ok) {
      localStorage.removeItem(PREVISIONS_NOVES_KEY);
      return { ok: true };
    }
    let detall = '';
    try {
      const errJson = await putResp.json();
      detall = errJson && errJson.message ? errJson.message : '';
    } catch (e) { /* resposta sense JSON llegible */ }
    return { ok: false, motiu: `HTTP ${putResp.status}${detall ? ' · ' + detall : ''}` };
  } catch (e) {
    return { ok: false, motiu: (e && e.message) ? e.message : 'error de xarxa' };
  }
}

function obtenirComptadorAvui() {
  const avui = new Date().toISOString().slice(0, 10);
  try {
    const raw = localStorage.getItem(POMODORO_COMPTADOR_KEY);
    const c = raw ? JSON.parse(raw) : null;
    return (c && c.data === avui) ? c.n : 0;
  } catch (e) { return 0; }
}
function incrementarComptadorAvui() {
  const avui = new Date().toISOString().slice(0, 10);
  const n = obtenirComptadorAvui() + 1;
  localStorage.setItem(POMODORO_COMPTADOR_KEY, JSON.stringify({ data: avui, n }));
  return n;
}

async function enviarPomodorosPendents() {
  const pendents = obtenirPomodorosPendents();
  if (!pendents.length) return { ok: true };
  const token = localStorage.getItem(GITHUB_TOKEN_KEY);
  if (!token) return { ok: false, motiu: 'sense token configurat' };
  const repo = obtenirRepoGithub();
  const url = `https://api.github.com/repos/${repo}/contents/${POMODORO_PATH}`;
  try {
    let sha = null;
    let remots = [];
    const getResp = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
    });
    if (getResp.ok) {
      const meta = await getResp.json();
      sha = meta.sha;
      // La Contents API ja retorna el contingut (base64) en la mateixa
      // crida -- l'aprofitem per fusionar, no només per llegir el sha.
      if (meta.content) {
        try {
          const decodificat = decodeURIComponent(escape(atob(meta.content.replace(/\n/g, ''))));
          const parsed = JSON.parse(decodificat);
          if (Array.isArray(parsed)) remots = parsed;
        } catch (e) { /* contingut il·legible -> es continua només amb els locals */ }
      }
    } else if (getResp.status !== 404) {
      return { ok: false, motiu: `error llegint el fitxer (HTTP ${getResp.status})` };
    }

    // Fusió, no sobreescriptura: si l'escriptori encara no ha consumit
    // el que hi havia al remot (p.ex. dos pomodoros seguits abans que
    // s'obri LEXAI), NO el descartem -- unim remot + locals pendents,
    // sense duplicar (per data + hora d'inici + tipus + llibre).
    const clau = s => `${s.data}|${s.hora_inici}|${s.tipus}|${s.llibre_id || ''}`;
    const clausRemots = new Set(remots.map(clau));
    const unio = remots.concat(pendents.filter(s => !clausRemots.has(clau(s))));

    const contingut = btoa(unescape(encodeURIComponent(JSON.stringify(unio))));
    const body = { message: 'LEXAI Mòbil: pomodoros pendents', content: contingut };
    if (sha) body.sha = sha;
    const putResp = await fetch(url, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (putResp.ok) {
      localStorage.removeItem(POMODORO_PENDENTS_KEY);
      return { ok: true };
    }
    let detall = '';
    try {
      const errJson = await putResp.json();
      detall = errJson && errJson.message ? errJson.message : '';
    } catch (e) { /* resposta sense JSON llegible */ }
    return { ok: false, motiu: `HTTP ${putResp.status}${detall ? ' · ' + detall : ''}` };
  } catch (e) {
    return { ok: false, motiu: (e && e.message) ? e.message : 'error de xarxa' };
  }
}

// ── So (beep generat, sense fitxers externs) ────────────────────────────

let _audioCtxPomodoro = null;

function desbloquejarAudioPomodoro() {
  // S'ha de cridar des d'un gest directe de l'usuari (el clic de ▶).
  // A iOS, un AudioContext creat des d'un setInterval (com abans, quan el
  // so sonava en confirmar la pàgina) o mai "desbloquejat" amb un toc real
  // es queda suspès i no sona -- per això ara es crea/reprèn AQUÍ.
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!_audioCtxPomodoro) _audioCtxPomodoro = new AudioCtx();
    if (_audioCtxPomodoro.state === 'suspended') _audioCtxPomodoro.resume();
  } catch (e) { /* sense Web Audio disponible -- simplement no sonarà */ }
}

function reproduirBeep(duradaSegons = 5) {
  // duradaSegons: durada total aproximada del so (configurable a "Configuració
  // del Pomodoro"). Es repeteix un beep de 0.32s cada 0.5s fins cobrir la
  // durada demanada, en lloc d'un nombre fix de repeticions.
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = _audioCtxPomodoro || new AudioCtx();
    const repeticions = Math.max(1, Math.round(duradaSegons / 0.5));
    for (let i = 0; i < repeticions; i++) {
      const t0 = ctx.currentTime + i * 0.5;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.exponentialRampToValueAtTime(0.3, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.3);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(t0); osc.stop(t0 + 0.32);
    }
  } catch (e) { /* so no disponible, cap problema */ }
  if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
}

// ── Temporitzador ─────────────────────────────────────────────────────────

function formatTemps(segons) {
  const m = Math.floor(segons / 60);
  const s = segons % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function pomoIniciar() {
  if (!pomo.enCurs && pomo.tipus === 'treball' && !pomo.llibreId) {
    mostrarConfirmacio(
      'Pomodoro sense llibre',
      'No has triat cap llibre. Vols fer aquest pomodoro sense llibre assignat?',
      'Sí, sense llibre', 'No, vull triar-ne un',
      () => pomoIniciarConfirmat());
    return;
  }
  pomoIniciarConfirmat();
}

function pomoIniciarConfirmat() {
  desbloquejarAudioPomodoro();
  const cfg = obtenirConfigPomodoro();
  if (!pomo.enCurs) {
    // La pàgina inicial ja s'ha triat/editat amb el camp en línia (preomplert
    // en seleccionar el llibre, però totalment editable); si per algun motiu
    // encara no hi ha valor, es deixa a 0 en lloc de bloquejar l'inici.
    if (pomo.tipus === 'treball' && pomo.llibreId && pomo.paginaInicial === null) {
      pomo.paginaInicial = 0;
    }
    pomo.enCurs = true;
    pomo.pausat = false;
    pomo.esperantConfirmacio = false;
    pomo.total = pomo.tipus === 'treball' ? cfg.durada_treball
               : (pomo.cicleNum === 0 ? cfg.durada_desc_llarg : cfg.durada_descans);
    pomo.restant = pomo.total;
    const ara = new Date();
    pomo.horaInici = ara.toTimeString().slice(0, 8);
    pomo.dataInici = ara.toISOString().slice(0, 10);
  } else if (pomo.pausat) {
    pomo.pausat = false;
  }
  clearInterval(pomo.interval);
  pomo.interval = setInterval(pomoTick, 1000);
  _activarWakeLock();
  renderPomodoro();
}

function pomoTriarLlibre(id) {
  if (pomo.enCurs) return; // no es pot canviar amb el temporitzador en marxa
  if (pomo.llibreId === id) {
    pomo.llibreId = null; pomo.llibreTitol = null; pomo.paginaInicial = null;
  } else {
    const llibre = state.llibresEnCurs.find(l => l.id === id);
    if (!llibre) return;
    pomo.llibreId = id;
    pomo.llibreTitol = llibre.titol;
    // Es preomple amb la pàgina actual del progrés, però és totalment
    // editable abans d'iniciar (potser has avançat sense fer focus).
    pomo.paginaInicial = llibre.pagina_actual || 0;
  }
  pomo.paginesLlegidesSessio = 0; // reiniciar l'ajust local en canviar de llibre
  renderPomodoro();
}

function pomoPausar() {
  if (!pomo.enCurs || pomo.pausat) return;
  pomo.pausat = true;
  clearInterval(pomo.interval);
  _desactivarWakeLock();
  renderPomodoro();
}

function pomoAturar() {
  if (!pomo.enCurs) return;
  const durada_real = pomo.total - pomo.restant;
  // Un descans cancel·lat no és una lectura interrompuda -- es guarda amb
  // un estat propi ('cancelat') i mai amb 'parcial' (que és per treball).
  if (durada_real > 10) {
    registrarSessioPomodoro(pomo.tipus === 'descans' ? 'cancelat' : 'parcial', durada_real);
  }
  clearInterval(pomo.interval);
  _desactivarWakeLock();
  pomo = {
    ...pomo, enCurs: false, pausat: false, restant: 0, interval: null,
    esperantConfirmacio: false,
    tipus: 'treball',  // clau: si no, el proper ▶ reprenia un altre descans
  };
  renderPomodoro();
}

function pomoTick() {
  if (pomo.pausat || !pomo.enCurs) return;
  pomo.restant--;
  if (pomo.restant <= 0) {
    clearInterval(pomo.interval);
    pomoAcabar();
    return;
  }
  renderPomodoro();
}

function pomoAcabar() {
  // El so ha de sonar AQUÍ, en el mateix instant que s'acaben els minuts --
  // no quan es confirma la pàgina final (que pot ser molt més tard si es
  // triga a mirar el mòbil).
  const cfg = obtenirConfigPomodoro();
  if (pomo.tipus === 'treball') {
    if (cfg.so_activat) reproduirBeep(cfg.so_durada);
  } else {
    if (cfg.so_descans) reproduirBeep(cfg.so_durada);
  }
  if (pomo.tipus === 'treball' && pomo.llibreId) {
    mostrarModalPaginaFinal();
    return;
  }
  pomoAcabarContinuar(null);
}

function mostrarConfirmacio(titol, missatge, textSi, textNo, onConfirmar) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-caixa">
      <div class="modal-titol">${escapeHtml(titol)}</div>
      <div class="modal-linia" style="margin:10px 0 4px;">${escapeHtml(missatge)}</div>
      <div class="confirmacio-botons">
        <button type="button" id="conf-no" class="confirmacio-btn-no">${escapeHtml(textNo)}</button>
        <button type="button" id="conf-si">${escapeHtml(textSi)}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#conf-no').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
  overlay.querySelector('#conf-si').addEventListener('click', () => {
    document.body.removeChild(overlay);
    onConfirmar();
  });
}

function pomoObrirFinalitzarAnticipat() {
  if (!pomo.enCurs || pomo.tipus !== 'treball' || !pomo.llibreId) return;
  mostrarModalPaginaFinal(true);
}

function mostrarModalPaginaFinal(anticipat = false) {
  const llibre = state.llibresEnCurs.find(l => l.id === pomo.llibreId);
  const inicial = pomo.paginaInicial || 0;
  const ritme = (llibre && llibre.pag_per_pomodoro) ? Math.round(llibre.pag_per_pomodoro) : null;
  let valor = ritme ? inicial + ritme : inicial;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modal-pagina-final';
  overlay.innerHTML = `
    <div class="modal-caixa modal-pagina-final-caixa">
      <div class="modal-titol">${anticipat ? 'Finalitzar pomodoro ara' : 'Pàgina final'}</div>
      <div class="modal-linia discreta">${escapeHtml(pomo.llibreTitol || '')} · inici: ${inicial}</div>
      <div class="pagina-final-stepper">
        <button type="button" class="pagina-final-btn" id="pf-menys" aria-label="Una pàgina menys">−</button>
        <div class="pagina-final-valor" id="pf-valor">${valor}</div>
        <button type="button" class="pagina-final-btn" id="pf-mes" aria-label="Una pàgina més">+</button>
      </div>
      <div class="pagina-final-pct" id="pf-pct"></div>
      <button type="button" class="pagina-final-mes10" id="pf-mes10">
        ${icona('piles', 12)} +10 pàg.
      </button>
      ${anticipat ? `
        <label class="pagina-final-check">
          <input type="checkbox" id="pf-llibre-acabat">
          He acabat el llibre
        </label>
      ` : ''}
      <button type="button" id="pf-confirmar">Confirmar</button>
      ${anticipat ? `
        <button type="button" id="pf-cancelar">Cancel·lar</button>
      ` : ''}
    </div>`;
  document.body.appendChild(overlay);

  const lblValor = overlay.querySelector('#pf-valor');
  const lblPct = overlay.querySelector('#pf-pct');

  function actualitzarPct() {
    if (ritme) {
      const fetes = valor - inicial;
      const pct = Math.max(0, Math.round((fetes / ritme) * 100));
      lblPct.textContent = `${pct}% del pomodoro esperat (~${ritme} pàg.)`;
    } else {
      lblPct.textContent = '';
    }
  }
  actualitzarPct();

  overlay.querySelector('#pf-menys').addEventListener('click', () => {
    valor = Math.max(0, valor - 1);
    lblValor.textContent = valor;
    actualitzarPct();
  });
  overlay.querySelector('#pf-mes').addEventListener('click', () => {
    valor += 1;
    lblValor.textContent = valor;
    actualitzarPct();
  });
  overlay.querySelector('#pf-mes10').addEventListener('click', () => {
    valor += 10;
    lblValor.textContent = valor;
    actualitzarPct();
  });
  overlay.querySelector('#pf-confirmar').addEventListener('click', () => {
    const chkAcabat = overlay.querySelector('#pf-llibre-acabat');
    const llibreAcabat = anticipat && chkAcabat && chkAcabat.checked;
    document.body.removeChild(overlay);
    if (anticipat) {
      pomoFinalitzarAnticipatConfirmar(valor, llibreAcabat);
    } else {
      pomoAcabarContinuar(valor);
    }
  });
  const bCancelar = overlay.querySelector('#pf-cancelar');
  if (bCancelar) {
    bCancelar.addEventListener('click', () => {
      // No es toca res: el focus (en marxa o pausat) segueix exactament
      // igual que abans d'obrir aquest modal -- no s'atura ni es registra
      // cap sessió fins que es prem "Confirmar".
      document.body.removeChild(overlay);
    });
  }
}

function pomoFinalitzarAnticipatConfirmar(paginaFinal, llibreAcabat) {
  // Finalitza el pomodoro ARA MATEIX (no ha arribat a 0): es guarda com a
  // 'parcial' (incomplet, no ha durat el temps previst) però -- a diferència
  // d'"Aturar" -- SÍ que es demana la pàgina final i es permet marcar el
  // llibre com a acabat. És la via pensada per als casos on ja has llegit
  // (encara que no s'hagi completat el temps) i no vols perdre-ho.
  clearInterval(pomo.interval);
  _desactivarWakeLock();
  const durada_real = pomo.total - pomo.restant;
  registrarSessioPomodoro('parcial', durada_real, paginaFinal, llibreAcabat);
  pomo.cicleNum = (pomo.cicleNum + 1) % 4;
  incrementarComptadorAvui();

  const llibreActualitzat = state.llibresEnCurs.find(l => l.id === pomo.llibreId);
  if (llibreActualitzat) {
    llibreActualitzat.pagina_actual = paginaFinal;
    llibreActualitzat.darrer_focus = new Date().toISOString().slice(0, 10);
    if (llibreAcabat) {
      // El llibre ja no és "en curs" -- el traiem de la llista en local.
      // L'escriptori el marcarà com a Llegit en importar aquest pomodoro
      // (flag llibre_acabat), i la propera sincronització confirmarà que
      // ja no hi surt.
      state.llibresEnCurs = state.llibresEnCurs.filter(l => l.id !== pomo.llibreId);
    } else {
      const llegides = paginaFinal - (pomo.paginaInicial || 0);
      if (!llibreActualitzat.pag_per_pomodoro && llegides > 0) {
        llibreActualitzat.pag_per_pomodoro = llegides;
      }
      if (llibreActualitzat.pag_per_pomodoro && llibreActualitzat.pagines) {
        const pagRestants = Math.max(0, llibreActualitzat.pagines - paginaFinal);
        llibreActualitzat.pomodoros_restants = Math.ceil(pagRestants / llibreActualitzat.pag_per_pomodoro);
      }
    }
    desarEstatLlibresEnCurs();
  }
  marcarUltimUsLlibre(pomo.llibreId);

  // Directament a punt per a un nou Focus -- no té sentit passar per la
  // pantalla de "Pomodoro completat!" quan no ha durat els minuts sencers.
  pomo = {
    ...pomo, enCurs: false, pausat: false, restant: 0, interval: null,
    esperantConfirmacio: false, tipus: 'treball',
  };
  mostrarToast(llibreAcabat
    ? '✓ Pomodoro parcial desat i llibre marcat com a acabat.'
    : '✓ Pomodoro parcial desat.');
  renderPomodoro();
}

function pomoAcabarContinuar(paginaFinal) {
  registrarSessioPomodoro('complet', pomo.total, paginaFinal);
  if (pomo.tipus === 'treball') {
    pomo.cicleNum = (pomo.cicleNum + 1) % 4;
    incrementarComptadorAvui();
    if (pomo.llibreId && paginaFinal !== null) {
      // Reduir la projecció EN LOCAL sense esperar la propera sincronització
      // (l'escriptori la reajustarà amb el ritme real un cop importi la sessió).
      const llegides = paginaFinal - (pomo.paginaInicial || 0);
      if (llegides > 0) pomo.paginesLlegidesSessio = (pomo.paginesLlegidesSessio || 0) + llegides;
      pomo.paginaInicial = paginaFinal; // el proper pomodoro comença on hem deixat
      // També a l'estat general del llibre -- si no, la resta de la UI
      // (targetes, selecció d'un altre llibre i tornar) seguia mostrant
      // la pàgina vella fins a la propera sincronització amb l'escriptori.
      const llibreActualitzat = state.llibresEnCurs.find(l => l.id === pomo.llibreId);
      if (llibreActualitzat) {
        llibreActualitzat.pagina_actual = paginaFinal;
        // Primer focus d'aquest llibre: encara no hi ha cap ritme conegut
        // (pag_per_pomodoro ve buit del sync). En lloc de deixar la
        // targeta sense número, l'estimem ja amb aquesta única mostra —
        // l'escriptori el refinarà amb la mitjana real un cop hi hagi
        // més sessions.
        if (!llibreActualitzat.pag_per_pomodoro && llegides > 0) {
          llibreActualitzat.pag_per_pomodoro = llegides;
        }
        // Recalculem amb la MATEIXA fórmula que la projecció de la caixa de
        // dalt (pàgines restants / pàg per pomodoro), en lloc de restar-hi 1
        // a cegues -- si aquell pomodoro concret ha llegit més o menys
        // pàgines que la mitjana, un simple "-1" es desalineava del número
        // que mostra la caixa de dalt.
        if (llibreActualitzat.pag_per_pomodoro && llibreActualitzat.pagines) {
          const pagRestants = Math.max(0, llibreActualitzat.pagines - paginaFinal);
          llibreActualitzat.pomodoros_restants = Math.ceil(pagRestants / llibreActualitzat.pag_per_pomodoro);
        } else if (typeof llibreActualitzat.pomodoros_restants === 'number') {
          llibreActualitzat.pomodoros_restants = Math.max(0, llibreActualitzat.pomodoros_restants - 1);
        }
        llibreActualitzat.darrer_focus = new Date().toISOString().slice(0, 10);
        // Persistir a localStorage -- si només toquem state en memòria, es
        // perd en recarregar l'app (per això mostrava una pàgina vella).
        desarEstatLlibresEnCurs();
      }
    }
    if (pomo.llibreId) marcarUltimUsLlibre(pomo.llibreId);
  }
  pomo.enCurs = false;
  pomo.esperantConfirmacio = true;
  renderPomodoro();
}

function registrarSessioPomodoro(estat, durada_real, paginaFinal = null, llibreAcabat = false) {
  const ara = new Date();
  const sessio = {
    tipus: pomo.tipus,
    data: pomo.dataInici,
    hora_inici: pomo.horaInici,
    hora_fi: ara.toTimeString().slice(0, 8),
    durada_prevista: pomo.total,
    durada_real: Math.max(0, durada_real),
    estat,
  };
  if (pomo.tipus === 'treball' && pomo.llibreId) {
    sessio.llibre_id = pomo.llibreId;
    sessio.pagina_inicial = pomo.paginaInicial;
    if (paginaFinal !== null) sessio.pagina_final = paginaFinal;
    if (llibreAcabat) sessio.llibre_acabat = true;
  }
  afegirPomodoroPendent(sessio);
  enviarPomodorosPendents(); // best-effort, no bloqueja
}

function pomoContinuarDescans() {
  pomo.tipus = 'descans';
  pomo.esperantConfirmacio = false;
  pomoIniciar();
}
function pomoContinuarTreball() {
  pomo.tipus = 'treball';
  pomo.esperantConfirmacio = false;
  pomoIniciar();
}
function pomoProuPerAra() {
  pomo.esperantConfirmacio = false;
  pomo.tipus = 'treball';
  pomo.restant = 0;
  _desactivarWakeLock();
  renderPomodoro();
}

// ── Utilitats ─────────────────────────────────────────────────────────────

function mesosDisponibles(rows) {
  const set = new Set(rows.map(r => r.mes_objectiu).filter(Boolean));
  // Sempre s'hi inclou el mes en curs, encara que encara no tingui cap
  // previsió -- si no, en obrir l'app un dia 1 sense res creat per aquest
  // mes, el fallback queda enganxat al mes més antic de la llista en lloc
  // d'obrir en el mes real d'avui.
  set.add(new Date().toISOString().slice(0, 7));
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

function aplicarNovesDades(previsionsRows, extra, meta) {
  if (previsionsRows.length === 0 && !extra) {
    mostrarToast('No hi ha cap previsió vàlida per carregar.');
    return;
  }
  // Reemplaçar TOTALMENT les dades anteriors (comportament acordat).
  // 'extra' (sagues/tbr/reptes) només arriba via GitHub; via CSV es manté
  // el que ja hi hagués (el CSV només conté previsions).
  const actual = carregarDades();
  const noves = {
    previsions: previsionsRows,
    sagues: extra ? (extra.sagues || []) : actual.sagues,
    tbr: extra ? (extra.tbr || []) : actual.tbr,
    reptes: extra ? (extra.reptes || null) : actual.reptes,
    llibresEnCurs: extra ? (extra.llibresEnCurs || []) : (actual.llibresEnCurs || []),
    mesosTancats: extra ? (extra.mesosTancats || []) : (actual.mesosTancats || []),
  };
  state.previsions = noves.previsions;
  state.sagues = noves.sagues;
  state.tbr = noves.tbr;
  state.reptes = noves.reptes;
  state.llibresEnCurs = noves.llibresEnCurs;
  state.mesosTancats = noves.mesosTancats;
  desarDades(noves);
  desarMeta(meta);

  state.mesos = mesosDisponibles(state.previsions);
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
  aplicarNovesDades(rows, null, {
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

  // Primer cop que sincronitzem: agafem la configuració de pomodoro de
  // l'escriptori com a punt de partida (després és editable al mòbil sense
  // que afecti l'escriptori).
  if (!localStorage.getItem(POMODORO_CONFIG_KEY) && dades.focus_config) {
    desarConfigPomodoro({ ...POMODORO_CONFIG_DEFECTE, ...dades.focus_config });
  }
  // Aprofitem que hi ha connexió per intentar pujar pomodoros i previsions
  // noves pendents.
  enviarPomodorosPendents();
  enviarPrevisionsNovesPendents();

  aplicarNovesDades(rows, {
    sagues: Array.isArray(dades.sagues) ? dades.sagues : [],
    tbr: Array.isArray(dades.tbr) ? dades.tbr : [],
    reptes: dades.reptes || null,
    llibresEnCurs: Array.isArray(dades.llibres_en_curs) ? dades.llibres_en_curs : [],
    mesosTancats: Array.isArray(dades.mesos_tancats) ? dades.mesos_tancats : [],
  }, {
    font: 'github',
    data_importacio: new Date().toISOString(),
    generat_el: dades.generat_el || null,
    n: rows.length,
  });
}

// ── Marcatge local ("el tinc a la mà") ─────────────────────────────────────

function toggleMarcat(id) {
  const r = state.previsions.find(x => x.id === id);
  if (!r) return;
  r.marcat = !r.marcat;
  desarDades({ previsions: state.previsions, sagues: state.sagues, tbr: state.tbr, reptes: state.reptes });
  render();
}

// ── Renderització ─────────────────────────────────────────────────────────

function render() {
  document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
    btn.classList.toggle('actiu', btn.getAttribute('data-tab') === state.tab);
  });

  // El Pomodoro gestiona el seu propi encaix exacte amb l'alçada de la
  // pantalla (.pomo-vista) -- el padding-bottom que necessiten la resta de
  // pestanyes (perquè l'scroll normal no quedi tapat per la barra inferior)
  // aquí sobra i feia que la pàgina sencera es fes més alta que la
  // pantalla, provocant un scroll general no desitjat.
  const mainEl = document.getElementById('main');
  if (mainEl) mainEl.style.paddingBottom = (state.tab === 'pomodoro') ? '0' : '';
  document.body.style.overflow = (state.tab === 'pomodoro') ? 'hidden' : '';

  const tbrFiltres = document.getElementById('tbr-filtres');
  if (tbrFiltres) tbrFiltres.style.display = 'none';

  if (state.tab === 'previsions') renderPrevisions();
  else if (state.tab === 'sagues') renderSagues();
  else if (state.tab === 'tbr') renderTbr();
  else if (state.tab === 'reptes') renderReptes();
  else if (state.tab === 'pomodoro') renderPomodoro();
}

function renderPrevisions() {
  const main = document.getElementById('main');
  const nav = document.getElementById('mes-nav');

  if (!state.previsions.length) {
    nav.style.display = 'none';
    main.innerHTML = `
      <div class="buit">
        <div class="icona">${icona('llibre', 40)}</div>
        <h2>Encara no tens cap previsió carregada</h2>
        <p>Importa el CSV generat des de LEXAI (Manteniment → Exportar per LEXAI Mòbil),
           o actualitza directament des de GitHub si ja tens la sincronització configurada.</p>
        <button class="btn-primari" id="btn-importar-buit">Importar CSV</button>
        <div style="height:10px;"></div>
        <button class="btn-marcar" id="btn-github-buit">${icona('refrescar', 15)} Actualitzar des de GitHub</button>
      </div>`;
    document.getElementById('btn-importar-buit').addEventListener('click', obrirSelectorFitxer);
    document.getElementById('btn-github-buit').addEventListener('click', actualitzarDesDeGithub);
    return;
  }

  nav.style.display = 'flex';
  document.getElementById('btn-mes-ant').style.visibility = 'visible';
  document.getElementById('btn-mes-seg').style.visibility = 'visible';
  const mesActual = state.mesos[state.mesIdx];
  const { text, any } = formatMes(mesActual);
  const tancat = (state.mesosTancats || []).includes(mesActual);
  document.getElementById('mes-label').innerHTML =
    `${tancat ? '🔒 ' : ''}${text} <small>${any}</small>`;
  document.getElementById('btn-mes-ant').disabled = state.mesIdx <= 0;
  document.getElementById('btn-mes-seg').disabled = state.mesIdx >= state.mesos.length - 1;
  const btnNova = document.getElementById('btn-nova-previsio');
  if (btnNova) {
    btnNova.style.display = tancat ? 'none' : 'flex';
    btnNova.onclick = () => obrirFormNovaPrevisio(mesActual);
  }

  const rowsDelMes = state.previsions.filter(r => r.mes_objectiu === mesActual);

  // Resum fix: sempre visible, independentment de si alguna secció és buida
  const nPend = rowsDelMes.filter(r => r.estat === 'pendent').length;
  const nTrans = rowsDelMes.filter(r => r.estat === 'transit').length;
  const nCompr = rowsDelMes.filter(r => r.estat === 'comprat').length;
  const eurPend = rowsDelMes.filter(r => r.estat === 'pendent').reduce((s, r) => s + (r.import_previst || 0), 0);
  const eurTrans = rowsDelMes.filter(r => r.estat === 'transit').reduce((s, r) => s + (r.import_previst || 0), 0);
  const eurCompr = rowsDelMes.filter(r => r.estat === 'comprat').reduce((s, r) => s + (r.import_real || r.import_previst || 0), 0);
  const nTotal = nPend + nTrans + nCompr;
  const eurTotal = eurPend + eurTrans + eurCompr;

  let html = `
    <div class="resum-mes">
      <div class="resum-cel pendent">
        <div class="n">${nPend}</div><div class="lbl">Pendents</div>
        <div class="eur">${formatPreu(eurPend) || '—'}</div>
      </div>
      <div class="resum-cel transit">
        <div class="n">${nTrans}</div><div class="lbl">Trànsit</div>
        <div class="eur">${formatPreu(eurTrans) || '—'}</div>
      </div>
      <div class="resum-cel comprat">
        <div class="n">${nCompr}</div><div class="lbl">Comprades</div>
        <div class="eur">${formatPreu(eurCompr) || '—'}</div>
      </div>
      <div class="resum-cel total">
        <div class="n">${nTotal}</div><div class="lbl">Total</div>
        <div class="eur">${formatPreu(eurTotal) || '—'}</div>
      </div>
    </div>`;

  for (const estat of ESTAT_ORDRE) {
    const grup = rowsDelMes.filter(r => r.estat === estat);
    if (!grup.length) continue;
    html += `<div class="seccio-titol ${estat}">${ESTAT_LABEL[estat]}
               <span class="comptador">${grup.length}</span></div>`;
    for (const r of grup) {
      html += renderCard(r);
    }
  }

  if (nTotal === 0) {
    html += `<div class="buit" style="padding:40px 24px;">
              <div class="icona">${icona('calendari', 40)}</div>
              <p>No hi ha cap previsió aquest mes.</p>
            </div>`;
  }

  main.innerHTML = html;

  main.querySelectorAll('[data-toggle-id]').forEach(btn => {
    btn.addEventListener('click', () => toggleMarcat(btn.getAttribute('data-toggle-id')));
  });
}

// ── Sagues ──────────────────────────────────────────────────────────────

function renderSagues() {
  const main = document.getElementById('main');
  const nav = document.getElementById('mes-nav');
  nav.style.display = 'none';

  if (!state.sagues.length) {
    main.innerHTML = `
      <div class="buit">
        <div class="icona">${icona('llibre', 40)}</div>
        <h2>Sense dades de sagues</h2>
        <p>Aquesta secció només s'omple sincronitzant amb GitHub (el CSV manual
           no inclou sagues).</p>
        <button class="btn-marcar" id="btn-github-sagues">${icona('refrescar', 15)} Actualitzar des de GitHub</button>
      </div>`;
    document.getElementById('btn-github-sagues').addEventListener('click', actualitzarDesDeGithub);
    return;
  }

  const enCurs = state.sagues.filter(s => !s.completa);
  const completes = state.sagues.filter(s => s.completa);

  let html = `<div class="seccio-titol" style="color:var(--text-label);">En curs
                <span class="comptador">${enCurs.length}</span></div>`;
  for (const s of enCurs) html += renderCardSaga(s);

  if (completes.length) {
    html += `<div class="seccio-titol comprat" style="margin-top:18px;">Completades
                <span class="comptador">${completes.length}</span></div>`;
    for (const s of completes) html += renderCardSaga(s);
  }

  main.innerHTML = html;
}

function renderCardSaga(s) {
  const total = s.total_previst;
  const pct = total ? Math.min(100, Math.round((s.llegits / total) * 100)) : 0;
  const badgeTxt = total ? `${s.llegits} de ${total}` : `${s.llegits} llegits`;
  const seguentHtml = (!s.completa && s.seguent_titol) ? `
    <div class="saga-seguent">Següent a llegir: <b>${escapeHtml(s.seguent_titol)}</b>${s.seguent_autor ? ' — ' + escapeHtml(s.seguent_autor) : ''}</div>
  ` : '';
  return `
    <div class="card-saga${s.completa ? ' completa' : ''}">
      <div class="saga-top">
        <div class="saga-nom">${escapeHtml(s.nom)}</div>
        <span class="saga-badge${s.completa ? ' completa' : ''}">${s.completa ? icona('check', 13) + ' Completa' : badgeTxt}</span>
      </div>
      <div class="progress-track"><div class="progress-fill${s.completa ? ' verd' : ''}" style="width:${pct}%"></div></div>
      <div class="saga-progres-txt"><span>${s.llegits} llegits</span><span>${total ? (total - s.llegits) + ' pendents' : ''}</span></div>
      ${seguentHtml}
    </div>`;
}

// ── TBR ─────────────────────────────────────────────────────────────────

function renderTbr() {
  const main = document.getElementById('main');
  const nav = document.getElementById('mes-nav');
  nav.style.display = 'none';
  const filtresEl = document.getElementById('tbr-filtres');

  if (!state.tbr.length) {
    if (filtresEl) filtresEl.style.display = 'none';
    main.innerHTML = `
      <div class="buit">
        <div class="icona">${icona('piles', 40)}</div>
        <h2>El TBR és buit</h2>
        <p>Aquesta secció només s'omple sincronitzant amb GitHub (el CSV manual
           no inclou el TBR).</p>
        <button class="btn-marcar" id="btn-github-tbr">${icona('refrescar', 15)} Actualitzar des de GitHub</button>
      </div>`;
    document.getElementById('btn-github-tbr').addEventListener('click', actualitzarDesDeGithub);
    return;
  }

  // Construir la barra de filtres un únic cop; delegació d'esdeveniments
  // (els botons es reutilitzen entre renders, no es recreen).
  if (filtresEl && !filtresEl.dataset.build) {
    filtresEl.innerHTML = TBR_CATEGORIES.map(c =>
      `<button class="tbr-filtre-btn" data-cat="${c.key}">${escapeHtml(c.label)}</button>`
    ).join('');
    filtresEl.dataset.build = '1';
    filtresEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.tbr-filtre-btn');
      if (!btn) return;
      state.tbrFiltreCategoria = btn.getAttribute('data-cat');
      renderTbr();
    });
  }
  if (filtresEl) {
    filtresEl.style.display = 'flex';
    filtresEl.querySelectorAll('.tbr-filtre-btn').forEach(b => {
      b.classList.toggle('actiu', b.getAttribute('data-cat') === state.tbrFiltreCategoria);
    });
  }

  const llista = !state.tbrFiltreCategoria
    ? state.tbr
    : state.tbrFiltreCategoria === 'classics'
      ? state.tbr.filter(t => t.es_classic)
      : state.tbr.filter(t => t.categoria === state.tbrFiltreCategoria);

  let html = `<div class="resum-mes" style="grid-template-columns: repeat(1,1fr);">
      <div class="resum-cel total"><div class="n">${llista.length}</div><div class="lbl">Llibres al TBR</div></div>
    </div>`;

  if (!llista.length) {
    html += `<div class="buit"><p>Cap llibre en aquest bloc.</p></div>`;
  }

  for (const t of llista) {
    html += `
      <div class="card-tbr">
        <div class="tbr-num">${t.posicio}</div>
        <div class="tbr-info">
          <div class="tbr-titol">${escapeHtml(t.titol)}</div>
          <div class="tbr-autor">${escapeHtml(t.autor || '')}</div>
          <div class="tbr-meta">
            <span class="pill">${escapeHtml(TBR_CATEGORIA_LABEL[t.categoria] || t.categoria || '')}</span>
            ${t.es_classic ? `<span class="pill">Clàssic</span>` : ''}
            ${t.serie_nom ? `<span class="pill">${icona('cantonada', 12)} ${escapeHtml(t.serie_nom)}</span>` : ''}
          </div>
        </div>
      </div>`;
  }
  main.innerHTML = html;
}

// ── Reptes ──────────────────────────────────────────────────────────────

function renderReptes() {
  const main = document.getElementById('main');
  const nav = document.getElementById('mes-nav');

  if (!state.reptes) {
    nav.style.display = 'none';
    main.innerHTML = `
      <div class="buit">
        <div class="icona">${icona('diana', 40)}</div>
        <h2>Sense dades de reptes</h2>
        <p>Aquesta secció només s'omple sincronitzant amb GitHub (el CSV manual
           no inclou els reptes).</p>
        <button class="btn-marcar" id="btn-github-reptes">${icona('refrescar', 15)} Actualitzar des de GitHub</button>
      </div>`;
    document.getElementById('btn-github-reptes').addEventListener('click', actualitzarDesDeGithub);
    return;
  }

  const r = state.reptes;
  const totes = [...r.categories, { categoria: 'comic', label: 'Còmic', ...r.comic },
                 { categoria: 'llibres_total', label: 'Llibres (total)', ...r.llibres_total }];
  const copesFetes = totes.filter(c => c.objectiu > 0 && c.llegits >= c.objectiu).length;

  nav.style.display = 'flex';
  document.getElementById('btn-mes-ant').style.visibility = 'hidden';
  document.getElementById('btn-mes-seg').style.visibility = 'hidden';
  document.getElementById('mes-label').innerHTML = `
    <div style="display:flex; align-items:center; justify-content:center; gap:8px;">
      <span>Reptes</span>
      <span class="copes-pill">${icona('copa', 14)} ${copesFetes}/${REPTES_CATEGORIES_COPA}</span>
    </div>
    <small>${r.any}</small>`;

  let html = renderCardObjectiu('Llibres (total)', r.llibres_total.objectiu, r.llibres_total.llegits, true);
  html += `<div class="seccio-titol" style="color:var(--text-label); margin-top:18px;">Per categoria</div>`;
  for (const c of r.categories) {
    html += renderCardObjectiu(c.label, c.objectiu, c.llegits, false);
  }
  html += `<div class="seccio-titol" style="color:var(--text-label); margin-top:18px;">Còmic (independent)</div>`;
  html += renderCardObjectiu('Còmic', r.comic.objectiu, r.comic.llegits, false);

  main.innerHTML = html;
}

function renderCardObjectiu(nom, objectiu, llegits, destacada) {
  const pct = objectiu ? Math.min(100, Math.round((llegits / objectiu) * 100)) : 0;
  const assolit = objectiu > 0 && llegits >= objectiu;
  const restants = Math.max(objectiu - llegits, 0);
  const classeBarra = assolit ? 'verd' : (pct >= 90 ? 'gold' : (destacada ? '' : 'verd'));
  return `
    <div class="card-objectiu${assolit ? ' assolit' : ''}"${destacada && !assolit ? ' style="border-color:var(--orange); background:var(--bg-selected);"' : ''}>
      <div class="obj-top">
        <div class="obj-nom">${escapeHtml(nom)}</div>
        <div class="obj-import">${assolit ? `<span class="copa">${icona('copa', 16)}</span>` : ''}<b>${llegits}</b> / ${objectiu}</div>
      </div>
      <div class="progress-track"><div class="progress-fill ${classeBarra}" style="width:${pct}%"></div></div>
      <div class="obj-detall${assolit ? ' assolit' : ''}"><span>${assolit ? '100% assolit' : pct + '%'}</span><span>${assolit ? 'Repte complert' : restants + ' pendents'}</span></div>
    </div>`;
}

function renderCard(r) {
  let iconaCat = '';
  if (r.categoria === 'impulsiu') {
    iconaCat = `<span class="card-icona-cat impulsiu" title="Compra impulsiva: no prevista">${icona('llamp', 16)}</span>`;
  } else if (r.categoria === 'inesperat') {
    iconaCat = `<span class="card-icona-cat inesperat" title="Inesperat: no era del pla original">${icona('cantonada', 16)}</span>`;
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

  if (r.tenda) pills.push(`<span class="pill tenda">${icona('botiga', 13)} ${escapeHtml(r.tenda)}</span>`);

  const data = r.estat === 'comprat' ? formatData(r.data_compra) : formatData(r.data_previsio);
  if (data) pills.push(`<span class="pill data">${icona('calendari', 13)} ${data}</span>`);

  const marcatCard = r.marcat ? ' marcat' : '';
  const mostraToggle = r.estat !== 'comprat';
  if (mostraToggle) {
    pills.push(`
      <button class="pill-toggle${r.marcat ? ' actiu' : ''}" data-toggle-id="${escapeHtml(r.id)}"
              title="${r.marcat ? 'El tinc a la mà — clic per desmarcar' : 'Marcar (a la botiga)'}">
        ${r.marcat ? icona('check', 15) : icona('carret', 15)}
      </button>`);
  }

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
    </div>`;
}

// ── Vista Pomodoro ──────────────────────────────────────────────────────

function ajustarAlturaPomodoro() {
  const vistaPomo = document.getElementById('pomo-vista');
  if (!vistaPomo) return;
  // Alçada disponible real (viewport − capçalera sticky − barra inferior)
  // perquè només la llista de targetes faci scroll (vertical) i el
  // rellotge/controls quedin sempre visibles.
  //
  // IMPORTANT: aquesta funció NOMÉS toca vistaPomo.style.height, mai
  // reconstrueix el contingut (innerHTML). Al mòbil, quan el teclat
  // virtual apareix (p.ex. en tocar el camp "Pàgina inicial"), el
  // navegador dispara un 'resize' -- si allà cridàvem renderPomodoro()
  // sencer, es destruïa l'<input> que tenia el focus i el teclat es
  // tancava a la mil·lèsima de segon (no es podia escriure). Per això
  // el resize NOMÉS recalcula l'alçada, no torna a pintar res.
  const headerEl = document.querySelector('header');
  const navEl = document.querySelector('.bottom-nav');
  const mainEl = document.getElementById('main');
  const hH = headerEl ? headerEl.getBoundingClientRect().height : 0;
  const nH = navEl ? navEl.getBoundingClientRect().height : 0;
  const topMain = mainEl ? mainEl.getBoundingClientRect().top : hH;
  const alt = Math.max(280, window.innerHeight - topMain - nH - 14);
  vistaPomo.style.height = `${alt}px`;
}

function renderPomodoro() {
  const main = document.getElementById('main');
  const nav = document.getElementById('mes-nav');
  nav.style.display = 'none';

  const cfg = obtenirConfigPomodoro();
  const colorTipus = pomo.tipus === 'treball' ? 'var(--orange)' : 'var(--green)';
  const etiquetaTipus = pomo.tipus === 'treball' ? 'Treball' : 'Descans';

  const punts = [0, 1, 2, 3].map(i =>
    `<span style="display:inline-block; width:9px; height:9px; border-radius:50%; margin:0 3px;
       background:${i < pomo.cicleNum ? 'var(--orange)' : 'var(--border-lt)'};"></span>`).join('');

  let contingutCentral;
  if (pomo.esperantConfirmacio) {
    const acabatTreball = pomo.tipus === 'treball';
    contingutCentral = `
      <div class="pomo-missatge">${icona('check', 34)}</div>
      <div class="pomo-titol-fase" style="color:var(--green);">
        ${acabatTreball ? 'Pomodoro completat!' : 'Descans acabat!'}
      </div>
      <div class="pomo-btns-confirm">
        <button class="btn-primari" id="pomo-continuar">
          ${acabatTreball ? (pomo.cicleNum === 0 ? 'Iniciar descans llarg' : 'Iniciar descans') : 'Nou pomodoro'}
        </button>
        <button class="btn-marcar" id="pomo-prou">Prou per ara</button>
      </div>`;
  } else {
    contingutCentral = `
      <div class="pomo-tipus-punts">
        <span class="pomo-tipus" style="color:${colorTipus};">${etiquetaTipus}</span>
        <span class="pomo-punts">${punts}</span>
      </div>
      <div class="pomo-rellotge-controls">
        <div class="pomo-temps">${formatTemps(pomo.enCurs ? pomo.restant : (pomo.tipus === 'treball' ? cfg.durada_treball : cfg.durada_descans))}</div>
        <div class="pomo-controls">
          ${!pomo.enCurs || pomo.pausat
            ? `<button class="pomo-btn-gran" id="pomo-play">${icona('play', 22)}</button>`
            : `<button class="pomo-btn-gran" id="pomo-pausa">${icona('pausa', 19)}</button>`}
          <div class="pomo-controls-fila-baixa">
            <button class="pomo-btn-mitja" id="pomo-stop" ${!pomo.enCurs ? 'disabled' : ''}
                    title="${pomo.tipus === 'descans' ? 'Cancel·lar descans' : 'Aturar'}">${icona('stop', 15)}</button>
            ${(pomo.tipus === 'treball' && pomo.enCurs && pomo.llibreId) ? `
              <button class="pomo-btn-mitja pomo-btn-finalitzar" id="pomo-finalitzar"
                      title="Finalitzar aquest pomodoro ara (parcial)">${icona('bandera', 14)}</button>
            ` : ''}
          </div>
        </div>
      </div>`;
  }

  const llibreSeleccionat = pomo.llibreId
    ? state.llibresEnCurs.find(l => l.id === pomo.llibreId) : null;
  const paginaMostrada = pomo.paginaInicial !== null
    ? pomo.paginaInicial
    : (llibreSeleccionat ? (llibreSeleccionat.pagina_actual || 0) : 0);

  let projeccioHtml = '';
  if (llibreSeleccionat && llibreSeleccionat.pag_per_pomodoro && llibreSeleccionat.pagines) {
    const paginaEfectiva = (llibreSeleccionat.pagina_actual || 0) + (pomo.paginesLlegidesSessio || 0);
    const pagRestants = Math.max(0, llibreSeleccionat.pagines - paginaEfectiva);
    const projeccioAjustada = Math.ceil(pagRestants / llibreSeleccionat.pag_per_pomodoro);
    const ajustat = pomo.paginesLlegidesSessio > 0;
    projeccioHtml = `<div class="pomo-projeccio${ajustat ? ' ajustat' : ''}">
        ~${projeccioAjustada} pomodoros per acabar${ajustat ? ' (ajustat ara mateix)' : ''}
      </div>`;
  }

  const llibreActualHtml = pomo.llibreId
    ? `<div class="pomo-llibre-pag-fila">
         ${icona('llibre', 14)}
         <span class="titol">${escapeHtml(pomo.llibreTitol)}</span>
         <label class="sep" for="pomo-pagina-inicial">· pàg.</label>
         <input type="number" id="pomo-pagina-inicial" min="0"
                value="${paginaMostrada}" ${pomo.enCurs ? 'disabled' : ''}>
         <button type="button" id="pomo-pagina-inicial-mes" aria-label="Sumar una pàgina"
                 ${pomo.enCurs ? 'disabled' : ''}>+</button>
       </div>
       ${projeccioHtml}`
    : '';

  let seccioLlibres = '';
  if (state.llibresEnCurs.length) {
    const usos = obtenirUltimsUsos();
    const llibresOrdenats = [...state.llibresEnCurs].sort((a, b) => {
      // 1r criteri: darrer_focus real (ve de l'escriptori, inclou
      // pomodoros fets tant al mòbil com a l'escriptori -- més fiable
      // que l'ús local, que només sap dels fets des d'aquest mòbil).
      const fa = a.darrer_focus || '', fb = b.darrer_focus || '';
      if (fa !== fb) return fa < fb ? 1 : -1; // més recent (data més gran) primer
      // 2n criteri (desempat, o si cap dels dos té darrer_focus): ús local
      const ua = usos[a.id] || 0, ub = usos[b.id] || 0;
      if (ua !== ub) return ub - ua;
      return (a.titol || '').localeCompare(b.titol || '');
    });
    const cards = llibresOrdenats.map(l => {
      const seleccionat = l.id === pomo.llibreId;
      const pct = l.pagines ? Math.min(100, Math.round((l.pagina_actual / l.pagines) * 100)) : null;
      const teRestants = typeof l.pomodoros_restants === 'number';
      return `
        <button class="card-llibre-pomo${seleccionat ? ' seleccionat' : ''}"
                data-llibre-id="${l.id}" ${pomo.enCurs ? 'disabled' : ''}>
          <div class="card-llibre-pomo-cos">
            <div class="card-llibre-pomo-titol">${escapeHtml(l.titol)}</div>
            ${l.autor ? `<div class="card-llibre-pomo-autor">${escapeHtml(l.autor)}</div>` : ''}
            <div class="card-llibre-pomo-pag">${l.pagina_actual || 0}${l.pagines ? ' / ' + l.pagines : ''} pàg.${pct !== null ? ' · ' + pct + '%' : ''}</div>
            ${l.pag_per_pomodoro ? `<div class="card-llibre-pomo-proj">≈${l.pag_per_pomodoro} pàg/pom</div>` : ''}
          </div>
          ${teRestants ? `
          <div class="card-llibre-pomo-restants" title="Pomodoros estimats per acabar el llibre">
            <span class="card-llibre-pomo-restants-num">${l.pomodoros_restants}</span>
            <span class="card-llibre-pomo-restants-lbl">pom.</span>
          </div>` : ''}
        </button>`;
    }).join('');
    seccioLlibres = `
      <div class="seccio-titol" style="color:var(--text-label); margin-top:20px;">
        Escollir llibre (${llibresOrdenats.length}) ${pomo.llibreId ? '· toca per treure la selecció' : ''}
      </div>
      <div class="pomo-llibres-scroll">${cards}</div>`;
  } else {
    seccioLlibres = `
      <div class="seccio-titol" style="color:var(--text-label); margin-top:20px;">Escollir llibre</div>
      <div class="pomo-sense-llibres">
        Cap llibre "Llegint" trobat. Sincronitza amb GitHub (🔄) després
        d'haver actualitzat i tancat/sincronitzat LEXAI a l'escriptori.
      </div>`;
  }

  main.innerHTML = `
    <div class="pomo-vista" id="pomo-vista">
      <div class="pomo-top-fix">
        <div class="pomo-header">
          <div class="pomo-header-titol">Pomodoro
            <span class="pomo-comptador-avui">${obtenirComptadorAvui()} avui</span>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn-icon" id="pomo-btn-pujar" title="Pujar pomodoros pendents ara">${icona('pujar', 18)}</button>
            <button class="btn-icon" id="pomo-btn-config" title="Configuració del Pomodoro">${icona('config', 18)}</button>
          </div>
        </div>
        <div class="pomo-caixa">
          ${llibreActualHtml}
          ${contingutCentral}
        </div>
      </div>
      <div class="pomo-llista-wrap">${seccioLlibres}</div>
    </div>`;

  ajustarAlturaPomodoro();

  const inputPagInicial = document.getElementById('pomo-pagina-inicial');
  if (inputPagInicial) {
    inputPagInicial.addEventListener('input', () => {
      const v = parseInt(inputPagInicial.value, 10);
      pomo.paginaInicial = isNaN(v) ? null : v;
    });
  }
  const btnPagInicialMes = document.getElementById('pomo-pagina-inicial-mes');
  if (btnPagInicialMes && inputPagInicial) {
    btnPagInicialMes.addEventListener('click', () => {
      const actual = parseInt(inputPagInicial.value, 10) || 0;
      const nou = actual + 1;
      inputPagInicial.value = nou;
      pomo.paginaInicial = nou;
    });
  }

  main.querySelectorAll('[data-llibre-id]').forEach(btn => {
    btn.addEventListener('click', () => pomoTriarLlibre(parseInt(btn.getAttribute('data-llibre-id'), 10)));
  });

  const bPlay = document.getElementById('pomo-play');
  if (bPlay) bPlay.addEventListener('click', pomoIniciar);
  const bPausa = document.getElementById('pomo-pausa');
  if (bPausa) bPausa.addEventListener('click', pomoPausar);
  const bStop = document.getElementById('pomo-stop');
  if (bStop) bStop.addEventListener('click', pomoAturar);
  const bFinalitzar = document.getElementById('pomo-finalitzar');
  if (bFinalitzar) bFinalitzar.addEventListener('click', pomoObrirFinalitzarAnticipat);
  const bContinuar = document.getElementById('pomo-continuar');
  if (bContinuar) bContinuar.addEventListener('click',
    pomo.tipus === 'treball' ? pomoContinuarDescans : pomoContinuarTreball);
  const bProu = document.getElementById('pomo-prou');
  if (bProu) bProu.addEventListener('click', pomoProuPerAra);
  const bCfg = document.getElementById('pomo-btn-config');
  if (bCfg) bCfg.addEventListener('click', () => configurarPomodoro());
  const bPujar = document.getElementById('pomo-btn-pujar');
  if (bPujar) bPujar.addEventListener('click', pujarPomodorosAra);
}



function mesAnterior() {
  if (state.tab === 'previsions' && state.mesIdx > 0) { state.mesIdx--; render(); }
}
function mesSeguent() {
  if (state.tab === 'previsions' && state.mesIdx < state.mesos.length - 1) { state.mesIdx++; render(); }
}

function canviarPestanya(tab) {
  state.tab = tab;
  render();
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

function injectarIconesFixes() {
  document.getElementById('btn-importar').innerHTML = `
    ${icona('importar', 19)}
    <div class="dropdown-menu oculta" id="menu-importar">
      <button class="opcio" id="opcio-github">${icona('github', 16)} Actualitzar des de GitHub</button>
      <button class="opcio" id="opcio-csv">${icona('csv', 16)} Importar CSV</button>
    </div>`;
  document.getElementById('btn-forcar-update').innerHTML = icona('forcar', 19);
  document.getElementById('btn-config-github').innerHTML = icona('config', 19);
  document.getElementById('btn-minimitzar').innerHTML = icona('minimitzar', 19);
  document.getElementById('btn-mes-ant').innerHTML = icona('chevronEsquerra', 20);
  document.getElementById('btn-mes-seg').innerHTML = icona('chevronDreta', 20);
  document.getElementById('nav-previsions').innerHTML = icona('calendari', 20) + '<span>Previsions</span>';
  document.getElementById('nav-sagues').innerHTML = icona('llibre', 20) + '<span>Sagues</span>';
  document.getElementById('nav-tbr').innerHTML = icona('piles', 20) + '<span>TBR</span>';
  document.getElementById('nav-reptes').innerHTML = icona('diana', 20) + '<span>Reptes</span>';
  document.getElementById('nav-pomodoro').innerHTML = icona('rellotge', 20) + '<span>Pomodoro</span>';

  document.getElementById('opcio-github').addEventListener('click', (ev) => {
    ev.stopPropagation();
    tancarMenuImportar();
    actualitzarDesDeGithub();
  });
  document.getElementById('opcio-csv').addEventListener('click', (ev) => {
    ev.stopPropagation();
    tancarMenuImportar();
    obrirSelectorFitxer();
  });
}

function toggleMenuImportar(ev) {
  ev.stopPropagation();
  document.getElementById('menu-importar').classList.toggle('oculta');
}
function tancarMenuImportar() {
  document.getElementById('menu-importar').classList.add('oculta');
}

function minimitzarApp() {
  // Cap pàgina web pot minimitzar-se de veritat per motius de seguretat del
  // navegador. window.blur() és el millor esforç possible; en molts mòbils
  // no farà res perceptible — el gest d'inici d'Android segueix sent la
  // manera fiable de fer-ho.
  try { window.blur(); } catch (e) {}
}

async function comprovarActualitzacio() {
  mostrarToast('Comprovant actualitzacions...');
  try {
    let versioAbans = null;
    if ('caches' in window) {
      const keys = await caches.keys();
      versioAbans = keys.sort().slice(-1)[0] || null;
    }
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) await reg.unregister();
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      for (const k of keys) await caches.delete(k);
    }
    sessionStorage.setItem('lexaiMobil_versio_abans', versioAbans || '');
  } catch (e) {
    console.warn('Error comprovant actualització:', e);
  }
  window.location.reload();
}

function comprovarResultatActualitzacio() {
  const versioAbans = sessionStorage.getItem('lexaiMobil_versio_abans');
  if (versioAbans === null) return; // no venim d'una comprovació manual
  sessionStorage.removeItem('lexaiMobil_versio_abans');
  setTimeout(async () => {
    try {
      const keys = ('caches' in window) ? await caches.keys() : [];
      const versioNova = keys.sort().slice(-1)[0] || '';
      if (versioAbans && versioNova && versioAbans !== versioNova) {
        mostrarToast(`Actualitzat: nova versió instal·lada (${versioNova}).`);
      } else if (versioAbans && versioAbans === versioNova) {
        mostrarToast('Ja tenies l\'última versió.');
      } else {
        mostrarToast('Actualització comprovada.');
      }
    } catch (e) {
      mostrarToast('Actualització comprovada.');
    }
  }, 700);
}

function obrirModalInfo() {
  document.getElementById('modal-versio').textContent = `Versió ${APP_VERSION}`;
  const meta = carregarMeta();
  const nPrevisions = document.getElementById('modal-n-previsions');
  const dataCarrega = document.getElementById('modal-data-carrega');
  if (meta) {
    nPrevisions.textContent = `${meta.n} previsions carregades`;
    const d = new Date(meta.data_importacio);
    const origen = meta.font === 'github' ? 'GitHub' : 'CSV';
    dataCarrega.textContent = `Darrera actualització (${origen}): ${d.toLocaleString('ca')}`;
  } else {
    nPrevisions.textContent = 'Cap dada carregada';
    dataCarrega.textContent = '';
  }
  document.getElementById('modal-info').classList.remove('oculta');
}
function tancarModalInfo() {
  document.getElementById('modal-info').classList.add('oculta');
}

// ── Inicialització ────────────────────────────────────────────────────────

function init() {
  const dades = carregarDades();
  state.previsions = dades.previsions;
  state.sagues = dades.sagues;
  state.tbr = dades.tbr;
  state.reptes = dades.reptes;
  state.llibresEnCurs = dades.llibresEnCurs || [];
  state.mesosTancats = dades.mesosTancats || [];
  state.mesos = mesosDisponibles(state.previsions);
  const mesActual = new Date().toISOString().slice(0, 7);
  const idxActual = state.mesos.indexOf(mesActual);
  state.mesIdx = idxActual >= 0 ? idxActual : 0;

  injectarIconesFixes();

  document.getElementById('btn-importar').addEventListener('click', toggleMenuImportar);
  document.addEventListener('click', tancarMenuImportar);
  document.getElementById('btn-forcar-update').addEventListener('click', comprovarActualitzacio);
  document.getElementById('btn-config-github').addEventListener('click', configurarUrlGithub);
  document.getElementById('btn-minimitzar').addEventListener('click', minimitzarApp);
  document.getElementById('input-csv').addEventListener('change', onFitxerSeleccionat);
  document.getElementById('btn-mes-ant').addEventListener('click', mesAnterior);
  document.getElementById('btn-mes-seg').addEventListener('click', mesSeguent);
  document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
    btn.addEventListener('click', () => canviarPestanya(btn.getAttribute('data-tab')));
  });
  document.getElementById('brand-title').addEventListener('click', obrirModalInfo);
  document.getElementById('brand-title').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') obrirModalInfo();
  });
  document.getElementById('btn-tancar-modal').addEventListener('click', tancarModalInfo);
  document.getElementById('modal-info').addEventListener('click', (e) => {
    if (e.target.id === 'modal-info') tancarModalInfo();
  });

  render();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch((e) => {
      console.warn('Service worker no registrat:', e);
    });
  }

  comprovarResultatActualitzacio();

  // Pujada automàtica de pomodoros pendents: cada cop que l'app passa a
  // segon pla o es tanca ("cada cop que es tanca/actualitza l'app").
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      enviarPomodorosPendents();
    } else if (pomo.enCurs && !pomo.pausat) {
      // El navegador allibera el Wake Lock sol quan la pantalla es bloqueja;
      // cal tornar-lo a demanar en tornar a l'app si el focus segueix actiu.
      _activarWakeLock();
    }
  });
  window.addEventListener('pagehide', () => { enviarPomodorosPendents(); });

  window.addEventListener('resize', () => {
    if (state.tab === 'pomodoro') ajustarAlturaPomodoro();
  });
  window.addEventListener('orientationchange', () => {
    if (state.tab === 'pomodoro') setTimeout(ajustarAlturaPomodoro, 200);
  });
}

document.addEventListener('DOMContentLoaded', init);
