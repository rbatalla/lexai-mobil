// LEXAI Mòbil — lògica de l'app
// Dades: importades des d'un CSV generat per LEXAI (Manteniment > Exportar per LEXAI Mòbil).
// Es guarden a localStorage. Cada nova importació REEMPLAÇA totalment les dades anteriors.

const APP_VERSION = '1.1.0';

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

const MESOS_CA = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny',
                   'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];

const ESTAT_ORDRE = ['pendent', 'transit', 'comprat'];
const ESTAT_LABEL = { pendent: 'Pendents', transit: 'En trànsit', comprat: 'Comprades' };

let state = {
  previsions: [],
  sagues: [],
  tbr: [],
  reptes: null,   // { any, llibres_total:{objectiu,llegits}, categories:[...], comic:{...} }
  mesos: [],      // llista ordenada de 'YYYY-MM' presents a les previsions
  mesIdx: 0,
  tab: 'previsions',  // 'previsions' | 'sagues' | 'tbr' | 'reptes'
};

// Categories de Reptes que compten per al comptador de copes (6 en total:
// les 4 de llibres + Còmic + Llibres-total com una copa més del conjunt).
const REPTES_CATEGORIES_COPA = 6;

// ── Persistència ──────────────────────────────────────────────────────────

function carregarDades() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { previsions: [], sagues: [], tbr: [], reptes: null };
    const d = JSON.parse(raw);
    return {
      previsions: d.previsions || [],
      sagues: d.sagues || [],
      tbr: d.tbr || [],
      reptes: d.reptes || null,
    };
  } catch (e) {
    console.error('Error llegint dades locals:', e);
    return { previsions: [], sagues: [], tbr: [], reptes: null };
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
  };
  state.previsions = noves.previsions;
  state.sagues = noves.sagues;
  state.tbr = noves.tbr;
  state.reptes = noves.reptes;
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
  aplicarNovesDades(rows, {
    sagues: Array.isArray(dades.sagues) ? dades.sagues : [],
    tbr: Array.isArray(dades.tbr) ? dades.tbr : [],
    reptes: dades.reptes || null,
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

  document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
    btn.classList.toggle('actiu', btn.getAttribute('data-tab') === state.tab);
  });

  if (state.tab === 'previsions') renderPrevisions();
  else if (state.tab === 'sagues') renderSagues();
  else if (state.tab === 'tbr') renderTbr();
  else if (state.tab === 'reptes') renderReptes();
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

// ── Navegació de mesos ──────────────────────────────────────────────────

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

function injectarIconesFixes() {
  document.getElementById('btn-importar').innerHTML = icona('importar', 19);
  document.getElementById('btn-importar-2').innerHTML = icona('importar', 15) + ' Importar CSV';
  document.getElementById('btn-github-2').innerHTML = icona('refrescar', 15) + ' GitHub';
  document.getElementById('btn-forcar-update').innerHTML = icona('forcar', 19);
  document.getElementById('btn-config-github').innerHTML = icona('config', 19);
  document.getElementById('btn-mes-ant').innerHTML = icona('chevronEsquerra', 20);
  document.getElementById('btn-mes-seg').innerHTML = icona('chevronDreta', 20);
  document.getElementById('nav-previsions').innerHTML = icona('calendari', 20) + '<span>Previsions</span>';
  document.getElementById('nav-sagues').innerHTML = icona('llibre', 20) + '<span>Sagues</span>';
  document.getElementById('nav-tbr').innerHTML = icona('piles', 20) + '<span>TBR</span>';
  document.getElementById('nav-reptes').innerHTML = icona('diana', 20) + '<span>Reptes</span>';
}

function obrirModalInfo() {
  document.getElementById('modal-versio').textContent = `Versió ${APP_VERSION}`;
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
  state.mesos = mesosDisponibles(state.previsions);
  const mesActual = new Date().toISOString().slice(0, 7);
  const idxActual = state.mesos.indexOf(mesActual);
  state.mesIdx = idxActual >= 0 ? idxActual : 0;

  injectarIconesFixes();

  document.getElementById('btn-importar').addEventListener('click', obrirSelectorFitxer);
  document.getElementById('btn-importar-2').addEventListener('click', obrirSelectorFitxer);
  document.getElementById('btn-github-2').addEventListener('click', actualitzarDesDeGithub);
  document.getElementById('btn-forcar-update').addEventListener('click', forcarActualitzacio);
  document.getElementById('btn-config-github').addEventListener('click', configurarUrlGithub);
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
}

document.addEventListener('DOMContentLoaded', init);
