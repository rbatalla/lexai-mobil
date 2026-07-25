// LEXAI Mòbil — lògica de l'app
// Dades: importades des d'un CSV generat per LEXAI (Manteniment > Exportar per LEXAI Mòbil).
// Es guarden a localStorage. Cada nova importació REEMPLAÇA totalment les dades anteriors.

const APP_VERSION = '1.5.1';

// ── Icones planes, un sol color (currentColor), sense emojis ──────────────
const ICONES = {
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
  github: '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>',
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
const POMODORO_CONFIG_DEFECTE = {
  durada_treball: 1500, durada_descans: 300, durada_desc_llarg: 900,
  so_activat: true, so_descans: false,
};

const MESOS_CA = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny',
                   'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];

const ESTAT_ORDRE = ['pendent', 'transit', 'comprat'];
const ESTAT_LABEL = { pendent: 'Pendents', transit: 'En trànsit', comprat: 'Comprades' };

let state = {
  previsions: [],
  sagues: [],
  tbr: [],
  reptes: null,   // { any, llibres_total:{objectiu,llegits}, categories:[...], comic:{...} }
  llibresEnCurs: [], // [{id, titol, autor, pagines, pagina_actual}]
  mesos: [],      // llista ordenada de 'YYYY-MM' presents a les previsions
  mesIdx: 0,
  tab: 'previsions',  // 'previsions' | 'sagues' | 'tbr' | 'reptes' | 'pomodoro'
};

// Categories de Reptes que compten per al comptador de copes (6 en total:
// les 4 de llibres + Còmic + Llibres-total com una copa més del conjunt).
const REPTES_CATEGORIES_COPA = 6;

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
    if (!raw) return { previsions: [], sagues: [], tbr: [], reptes: null, llibresEnCurs: [] };
    const d = JSON.parse(raw);
    return {
      previsions: d.previsions || [],
      sagues: d.sagues || [],
      tbr: d.tbr || [],
      reptes: d.reptes || null,
      llibresEnCurs: d.llibresEnCurs || [],
    };
  } catch (e) {
    console.error('Error llegint dades locals:', e);
    return { previsions: [], sagues: [], tbr: [], reptes: null, llibresEnCurs: [] };
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

function configurarTokenGithub() {
  const repoActual = obtenirRepoGithub();
  const repoNou = window.prompt(
    "Repositori de GitHub (usuari/nom) on pujar els pomodoros:", repoActual);
  if (repoNou === null) return;
  if (repoNou.trim()) localStorage.setItem(GITHUB_REPO_KEY, repoNou.trim());

  const tokenActual = localStorage.getItem(GITHUB_TOKEN_KEY) || '';
  const tokenNou = window.prompt(
    "Token de GitHub amb permís d'escriptura sobre aquest repositori\n" +
    "(es guarda només en aquest mòbil, mai al codi):",
    tokenActual ? '••••••••' : '');
  if (tokenNou === null) return;
  if (tokenNou && tokenNou !== '••••••••') {
    localStorage.setItem(GITHUB_TOKEN_KEY, tokenNou.trim());
  }
  mostrarToast('Configuració de pujada desada.');
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
  if (!pendents.length) return;
  const token = localStorage.getItem(GITHUB_TOKEN_KEY);
  if (!token) return; // sense token configurat, es queden pendents localment
  const repo = obtenirRepoGithub();
  const url = `https://api.github.com/repos/${repo}/contents/${POMODORO_PATH}`;
  try {
    let sha = null;
    const getResp = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
    });
    if (getResp.ok) {
      sha = (await getResp.json()).sha;
    } else if (getResp.status !== 404) {
      return; // error temporal, es reintentarà en el proper trigger
    }
    const contingut = btoa(unescape(encodeURIComponent(JSON.stringify(pendents))));
    const body = { message: 'LEXAI Mòbil: pomodoros pendents', content: contingut };
    if (sha) body.sha = sha;
    const putResp = await fetch(url, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (putResp.ok) {
      localStorage.removeItem(POMODORO_PENDENTS_KEY);
    }
  } catch (e) {
    console.warn('Error pujant pomodoros (es reintentarà):', e);
  }
}

// ── So (beep generat, sense fitxers externs) ────────────────────────────

function reproduirBeep(repeticions = 1) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
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
  renderPomodoro();
}

function pomoAturar() {
  if (!pomo.enCurs) return;
  const durada_real = pomo.total - pomo.restant;
  if (durada_real > 10) { // no val la pena desar interrupcions immediates
    registrarSessioPomodoro('parcial', durada_real);
  }
  clearInterval(pomo.interval);
  pomo = { ...pomo, enCurs: false, pausat: false, restant: 0, interval: null, esperantConfirmacio: false };
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
  const cfg = obtenirConfigPomodoro();
  let paginaFinal = null;
  if (pomo.tipus === 'treball' && pomo.llibreId) {
    const resposta = window.prompt(
      `Pàgina final de "${pomo.llibreTitol}" (inici: ${pomo.paginaInicial}):`,
      String(pomo.paginaInicial || 0));
    if (resposta !== null) paginaFinal = parseInt(resposta, 10) || null;
  }
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
    }
    if (cfg.so_activat) reproduirBeep(1);
  } else {
    if (cfg.so_descans) reproduirBeep(1);
  }
  pomo.enCurs = false;
  pomo.esperantConfirmacio = true;
  renderPomodoro();
}

function registrarSessioPomodoro(estat, durada_real, paginaFinal = null) {
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
  renderPomodoro();
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
  };
  state.previsions = noves.previsions;
  state.sagues = noves.sagues;
  state.tbr = noves.tbr;
  state.reptes = noves.reptes;
  state.llibresEnCurs = noves.llibresEnCurs;
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
  // Aprofitem que hi ha connexió per intentar pujar pomodoros pendents.
  enviarPomodorosPendents();

  aplicarNovesDades(rows, {
    sagues: Array.isArray(dades.sagues) ? dades.sagues : [],
    tbr: Array.isArray(dades.tbr) ? dades.tbr : [],
    reptes: dades.reptes || null,
    llibresEnCurs: Array.isArray(dades.llibres_en_curs) ? dades.llibres_en_curs : [],
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
  document.getElementById('mes-label').innerHTML = `${text} <small>${any}</small>`;
  document.getElementById('btn-mes-ant').disabled = state.mesIdx <= 0;
  document.getElementById('btn-mes-seg').disabled = state.mesIdx >= state.mesos.length - 1;

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

  if (!state.tbr.length) {
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

  let html = `<div class="resum-mes" style="grid-template-columns: repeat(1,1fr);">
      <div class="resum-cel total"><div class="n">${state.tbr.length}</div><div class="lbl">Llibres al TBR</div></div>
    </div>`;

  for (const t of state.tbr) {
    html += `
      <div class="card-tbr">
        <div class="tbr-num">${t.posicio}</div>
        <div class="tbr-info">
          <div class="tbr-titol">${escapeHtml(t.titol)}</div>
          <div class="tbr-autor">${escapeHtml(t.autor || '')}</div>
          <div class="tbr-meta">
            <span class="pill">${escapeHtml(t.categoria || '')}</span>
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
  const btnToggle = mostraToggle ? `
    <div class="card-bottom">
      <button class="btn-marcar${r.marcat ? ' actiu' : ''}" data-toggle-id="${escapeHtml(r.id)}">
        ${r.marcat ? icona('check', 15) + ' El tinc a la mà' : icona('carret', 15) + ' Marcar (a la botiga)'}
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

// ── Vista Pomodoro ──────────────────────────────────────────────────────

function configurarDuradesPomodoro() {
  const cfg = obtenirConfigPomodoro();
  const t = window.prompt("Durada del treball (minuts):", Math.round(cfg.durada_treball / 60));
  if (t === null) return;
  const d = window.prompt("Durada del descans curt (minuts):", Math.round(cfg.durada_descans / 60));
  if (d === null) return;
  const dl = window.prompt("Durada del descans llarg, cada 4 (minuts):", Math.round(cfg.durada_desc_llarg / 60));
  if (dl === null) return;
  const nt = parseInt(t, 10), nd = parseInt(d, 10), ndl = parseInt(dl, 10);
  if (nt > 0) cfg.durada_treball = nt * 60;
  if (nd > 0) cfg.durada_descans = nd * 60;
  if (ndl > 0) cfg.durada_desc_llarg = ndl * 60;
  desarConfigPomodoro(cfg);
  mostrarToast('Durades del pomodoro desades.');
  if (!pomo.enCurs) renderPomodoro();
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
      <div class="pomo-tipus" style="color:${colorTipus};">${etiquetaTipus}</div>
      <div class="pomo-temps">${formatTemps(pomo.enCurs ? pomo.restant : (pomo.tipus === 'treball' ? cfg.durada_treball : cfg.durada_descans))}</div>
      <div class="pomo-punts">${punts}</div>
      <div class="pomo-controls">
        ${!pomo.enCurs || pomo.pausat
          ? `<button class="pomo-btn-gran" id="pomo-play">${icona('play', 26)}</button>`
          : `<button class="pomo-btn-gran" id="pomo-pausa">${icona('pausa', 24)}</button>`}
        <button class="pomo-btn-mitja" id="pomo-stop" ${!pomo.enCurs ? 'disabled' : ''}>${icona('stop', 20)}</button>
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
    ? `<div class="pomo-llibre-actiu">${icona('llibre', 15)} ${escapeHtml(pomo.llibreTitol)}</div>
       ${projeccioHtml}
       <div class="pomo-pagina-inicial-fila">
         <label for="pomo-pagina-inicial">Pàgina inicial:</label>
         <input type="number" id="pomo-pagina-inicial" min="0"
                value="${paginaMostrada}" ${pomo.enCurs ? 'disabled' : ''}>
       </div>`
    : '';

  let seccioLlibres = '';
  if (state.llibresEnCurs.length) {
    const cards = state.llibresEnCurs.map(l => {
      const seleccionat = l.id === pomo.llibreId;
      const pct = l.pagines ? Math.min(100, Math.round((l.pagina_actual / l.pagines) * 100)) : null;
      const extra = [];
      if (l.pag_per_pomodoro) extra.push(`≈${l.pag_per_pomodoro} pàg/pom`);
      if (l.pomodoros_restants) extra.push(`~${l.pomodoros_restants} pom. per acabar`);
      return `
        <button class="card-llibre-pomo${seleccionat ? ' seleccionat' : ''}"
                data-llibre-id="${l.id}" ${pomo.enCurs ? 'disabled' : ''}>
          <div class="card-llibre-pomo-titol">${escapeHtml(l.titol)}</div>
          ${l.autor ? `<div class="card-llibre-pomo-autor">${escapeHtml(l.autor)}</div>` : ''}
          <div class="card-llibre-pomo-pag">${l.pagina_actual || 0}${l.pagines ? ' / ' + l.pagines : ''} pàg.${pct !== null ? ' · ' + pct + '%' : ''}</div>
          ${extra.length ? `<div class="card-llibre-pomo-proj">${extra.join(' · ')}</div>` : ''}
        </button>`;
    }).join('');
    seccioLlibres = `
      <div class="seccio-titol" style="color:var(--text-label); margin-top:20px;">
        Llibre (opcional) ${pomo.llibreId ? '· toca per treure la selecció' : ''}
      </div>
      <div class="pomo-llibres-scroll">${cards}</div>`;
  } else {
    seccioLlibres = `
      <div class="seccio-titol" style="color:var(--text-label); margin-top:20px;">Llibre (opcional)</div>
      <div class="pomo-sense-llibres">
        Cap llibre "Llegint" trobat. Sincronitza amb GitHub (🔄) després
        d'haver actualitzat i tancat/sincronitzat LEXAI a l'escriptori.
      </div>`;
  }

  main.innerHTML = `
    <div class="pomo-header">
      <div class="pomo-header-titol">Pomodoro
        <span class="pomo-comptador-avui">${obtenirComptadorAvui()} avui</span>
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn-icon" id="pomo-btn-config-durades" title="Durades">${icona('config', 18)}</button>
        <button class="btn-icon" id="pomo-btn-config-token" title="Configurar pujada a GitHub">${icona('github', 18)}</button>
      </div>
    </div>
    <div class="pomo-caixa">
      ${llibreActualHtml}
      ${contingutCentral}
    </div>
    ${seccioLlibres}
    <div class="pomo-nota">
      Els pomodoros fets aquí es pugen sols a GitHub (si tens el token configurat)
      i LEXAI els important en obrir o tancar el programa.
    </div>`;

  const inputPagInicial = document.getElementById('pomo-pagina-inicial');
  if (inputPagInicial) {
    inputPagInicial.addEventListener('input', () => {
      const v = parseInt(inputPagInicial.value, 10);
      pomo.paginaInicial = isNaN(v) ? null : v;
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
  const bContinuar = document.getElementById('pomo-continuar');
  if (bContinuar) bContinuar.addEventListener('click',
    pomo.tipus === 'treball' ? pomoContinuarDescans : pomoContinuarTreball);
  const bProu = document.getElementById('pomo-prou');
  if (bProu) bProu.addEventListener('click', pomoProuPerAra);
  const bCfgDur = document.getElementById('pomo-btn-config-durades');
  if (bCfgDur) bCfgDur.addEventListener('click', configurarDuradesPomodoro);
  const bCfgTok = document.getElementById('pomo-btn-config-token');
  if (bCfgTok) bCfgTok.addEventListener('click', configurarTokenGithub);
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
    if (document.hidden) enviarPomodorosPendents();
  });
  window.addEventListener('pagehide', () => { enviarPomodorosPendents(); });
}

document.addEventListener('DOMContentLoaded', init);
