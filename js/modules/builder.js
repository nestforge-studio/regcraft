// builder.js - builder state, rendering, validation, dnd helpers
import { $, $$ } from './utils.js';
import { BLOCKS, COLORS } from './constants.js';
import { updateLanguageSnippet } from './snippets.js';
import { highlight } from './highlight.js';

// State
export let sequence = [];
export let nextId = 1;
let externalRegex = null; // when set, overrides built regex

// Elements
const canvas = $('#canvas');
const regexOut = $('#regex-output');
const validationMsg = $('#validation-msg');
const testInput = $('#test-input');
const presetSelect = $('#preset-select');

// Flags
const flagsEl = { i: $('#flag-i'), m: $('#flag-m'), g: $('#flag-g') };

export function getFlags(){
  return {
    i: !!(flagsEl.i && flagsEl.i.checked),
    m: !!(flagsEl.m && flagsEl.m.checked),
    g: !!(flagsEl.g && flagsEl.g.checked)
  };
}

// Palette setup
export function initPalette(){
  const palette = $('#palette');
  BLOCKS.forEach((b) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.draggable = true;
    btn.className = 'block text-left text-sm border rounded px-2 py-1 hover:bg-slate-50 active:scale-[.98]';
    btn.textContent = b.label;
    btn.dataset.blockKey = b.key;
    if(b.desc){ btn.title = b.desc; btn.setAttribute('aria-label', b.desc); }
    btn.addEventListener('dragstart', (e)=>{
      e.dataTransfer.setData('text/plain', JSON.stringify({source:'palette', key:b.key}));
    });
    btn.addEventListener('click', ()=>{ addBlockFromPalette(b); });
    palette.appendChild(btn);
  });
}

// Drag-and-drop handlers
export function bindDnd(){
  let lastMarkerIndex = -1;
  canvas.addEventListener('dragover', (e)=>{
    e.preventDefault();
    const index = getDropIndex(canvas, e.clientX, e.clientY);
    if(index === lastMarkerIndex) return; // avoid jitter from redundant DOM ops
    lastMarkerIndex = index;
    const markerId = 'drop-marker';
    let marker = document.getElementById(markerId);
    if(!marker){
      marker = document.createElement('div');
      marker.id = markerId;
      marker.style.pointerEvents = 'none';
      marker.className = 'w-2 h-8 bg-sky-400 rounded opacity-60';
    }
    const ref = chipAtIndex(index);
    if(ref){ canvas.insertBefore(marker, ref); } else { canvas.appendChild(marker); }
  });
  canvas.addEventListener('dragleave', ()=>{ lastMarkerIndex = -1; removeMarker(); });
  canvas.addEventListener('drop', (e)=>{
    e.preventDefault();
    const payload = JSON.parse(e.dataTransfer.getData('text/plain'));
    const insertIndex = getDropIndex(canvas, e.clientX, e.clientY);
    lastMarkerIndex = -1;
    removeMarker();

    if(payload.source === 'palette'){
      const block = BLOCKS.find(x=>x.key===payload.key);
      addBlockFromPalette(block, insertIndex);
    } else if(payload.source === 'canvas'){
      const fromIndex = Number(payload.index);
      moveBlock(fromIndex, insertIndex);
    }
  });
}

function removeMarker(){
  const marker = document.getElementById('drop-marker');
  if(marker) marker.remove();
}

export function getDropIndex(container, x, y){
  const chips = [...container.querySelectorAll('[data-chip]')];
  if(chips.length === 0) return 0;
  let best = null; let bestScore = Infinity;
  for(const el of chips){
    const rect = el.getBoundingClientRect();
    const withinY = (y >= rect.top && y <= rect.bottom);
    const cx = rect.left + rect.width/2;
    const dx = Math.abs(x - cx);
    const dy = withinY ? 0 : (y < rect.top ? rect.top - y : y - rect.bottom);
    const score = dx + dy * 2;
    if(score < bestScore){ bestScore = score; best = el; }
  }
  if(!best) return chips.length;
  const r = best.getBoundingClientRect();
  const after = x > (r.left + r.width/2);
  const baseIdx = Number(best.getAttribute('data-index'));
  const idx = baseIdx + (after ? 1 : 0);
  return Math.max(0, Math.min(idx, chips.length));
}

function chipAtIndex(idx){ return canvas.querySelector(`[data-index="${idx}"]`); }

export function addBlockFromPalette(block, insertIndex){
  if(!block) return;
  let value = undefined;
  if(block.input === 'text'){
    value = prompt(`Enter ${block.placeholder}:`, '');
    if(value === null) return;
  }
  if(block.input === 'number'){
    value = prompt(`Enter ${block.placeholder}:`, '1');
    if(value === null) return;
    if(!/^[0-9]+$/.test(value)) { showError('Please enter a positive integer.'); return; }
  }
  if(block.input === 'range'){
    value = prompt('Enter m,n (e.g., 2,5):', '2,5');
    if(value === null) return;
    if(!/^[0-9]+,[0-9]+$/.test(value)) { showError('Please enter two integers like 2,5'); return; }
  }

  const unit = { id: nextId++, key:block.key, type:block.type };
  if(value) unit.value = value;

  if(block.type === 'quant' || block.type === 'quantParam' || block.type === 'quantRange'){
    if(insertIndex == null) insertIndex = sequence.length;
    const targetIndex = insertIndex-1;
    if(targetIndex < 0){ showError('A quantifier must follow something to quantify.'); return; }
    const target = sequence[targetIndex];
    if(!isQuantifiable(target)){
      showError('Cannot apply a quantifier to this block.');
      return;
    }
    target.attachedQuant = serializeQuant(block, value);
    render();
    return;
  }

  if(isColorized(unit)) unit.colorIndex = calcNextColorIndex();

  if(insertIndex == null) insertIndex = sequence.length;
  sequence.splice(insertIndex, 0, unit);
  render();
}

function serializeQuant(block, value){
  if(block.type==='quant') return block.pattern;
  if(block.type==='quantParam') return typeof block.pattern==='function' ? block.pattern(value) : '';
  if(block.type==='quantRange'){
    const [m,n] = value.split(',');
    return block.pattern(m,n);
  }
  return '';
}

export function moveBlock(from, to){
  if(from === to || from+1 === to) return;
  const [item] = sequence.splice(from,1);
  if(to>from) to--;
  sequence.splice(to,0,item);
  render();
}

export function render(){
  // rebuild chips
  canvas.innerHTML = '';
  sequence.forEach((u, idx) => {
    const chip = document.createElement('div');
    chip.className = `inline-flex items-center gap-1 border rounded px-2 py-1 text-sm select-none ${colorFor(u)}`;
    chip.setAttribute('data-chip','');
    chip.setAttribute('data-index', String(idx));
    chip.draggable = true;
    chip.addEventListener('dragstart', (e)=>{
      e.dataTransfer.setData('text/plain', JSON.stringify({source:'canvas', index:idx}));
    });

    const label = document.createElement('span');
    label.textContent = displayLabel(u);
    chip.appendChild(label);
    chip.title = describeUnit(u);

    if(u.attachedQuant){
      const q = document.createElement('span');
      q.className = 'text-slate-600';
      q.textContent = u.attachedQuant;
      chip.appendChild(q);
    }

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'ml-1 text-slate-500 hover:text-red-600';
    del.innerHTML = '&times;';
    del.title = 'Remove block';
    del.addEventListener('click', ()=>{ sequence.splice(idx,1); render(); });
    chip.appendChild(del);

    canvas.appendChild(chip);
  });

  const { valid, message } = validateSequence(sequence);
  validationMsg.textContent = valid ? '' : message;
  let regex = valid ? buildRegex(sequence) : '';
  if(externalRegex !== null){
    // When using free text override, trust external regex and suppress validation text from builder
    regex = externalRegex;
    validationMsg.textContent = '';
  }
  regexOut.textContent = regexWithFlags(regex);

  updateLanguageSnippet(regex);

  const flags = getFlags();
  highlight(testInput.value, regex, sequence, flags, {
    getRegExp,
    unitColorIndex,
    isColorized
  });
}

function displayLabel(u){
  switch(u.type){
    case 'literal': return `"${u.value || ''}"`;
    case 'atom': return (BLOCKS.find(b=>b.key===u.key).label.split(' ')[0]);
    case 'groupOpen': return '(';
    case 'groupClose': return ')';
    case 'alternation': return '|';
    case 'anchorStart': return '^';
    case 'anchorEnd': return '$';
    default: return u.key;
  }
}

function describeUnit(u){
  const def = BLOCKS.find(b=>b.key===u.key) || {};
  const base = def.desc ? def.desc : (def.label || u.key);
  let part = '';
  if(u.type==='literal') part = typeof def.pattern==='function' ? def.pattern(u.value) : '';
  else if(u.type==='atom') part = (typeof def.pattern === 'function' ? def.pattern(u.value) : def.pattern);
  else if(['groupOpen','groupClose','alternation','anchorStart','anchorEnd'].includes(u.type)) part = def.pattern;
  const quant = u.attachedQuant || '';
  const rx = `${part}${quant}`;
  return `${base}${rx?`\nRegex: ${rx}`:''}`;
}

function colorFor(u){
  const COLORLESS = 'bg-white text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600';
  if(!u || u.type==='anchorStart' || u.type==='anchorEnd' || u.type==='alternation' || u.type==='groupClose') return COLORLESS;
  if(typeof u.colorIndex === 'number') return COLORS[u.colorIndex % COLORS.length];
  return COLORLESS;
}

function calcNextColorIndex(){
  const used = sequence.filter(isColorized).map(u=>u.colorIndex).filter(v=>typeof v==='number');
  const next = (Math.max(-1, ...used) + 1);
  return next;
}

function validateSequence(seq){
  let depth = 0;
  for(let i=0;i<seq.length;i++){
    const cur = seq[i];
    const prev = seq[i-1];
    const next = seq[i+1];

    if(cur.type==='anchorStart' && i!==0) return {valid:false, message:'^ must be at the start.'};
    if(cur.type==='anchorEnd' && i!==seq.length-1) return {valid:false, message:'$ must be at the end.'};

    if(cur.type==='alternation'){
      if(i===0 || i===seq.length-1) return {valid:false, message:'| cannot be first or last.'};
      if(prev && (prev.type==='alternation' || prev.type==='groupOpen')) return {valid:false, message:'| cannot follow | or (.'};
      if(next && (next.type==='alternation' || next.type==='groupClose' || next.type==='anchorEnd')) return {valid:false, message:'| cannot be before |, ) or $.'};
    }

    if(cur.type==='groupOpen') depth++;
    if(cur.type==='groupClose'){
      depth--;
      if(depth<0) return {valid:false, message:'Unmatched ) detected.'};
    }

    if((cur.type==='quant' || cur.type==='quantParam' || cur.type==='quantRange')){
      return {valid:false, message:'Quantifiers must be attached to a preceding block.'};
    }
  }
  if(depth!==0) return {valid:false, message:'Unmatched ( detected.'};

  const last = seq[seq.length-1];
  if(last && (last.type==='alternation' || last.type==='groupOpen')){
    return {valid:false, message:'Sequence cannot end with | or (.'};
  }

  return {valid:true, message:''};
}

function isSpecial(u){
  return ['anchorStart','anchorEnd','alternation','groupOpen','groupClose'].includes(u.type);
}

export function isColorized(u){
  return u && (u.type==='atom' || u.type==='literal' || u.type==='groupOpen');
}

function isQuantifiable(u){
  return u && (u.type==='atom' || u.type==='literal' || u.type==='groupClose' || u.type==='groupOpen');
}

function buildRegex(seq){
  let regex = '';
  for(let i=0;i<seq.length;i++){
    const u = seq[i];
    const def = BLOCKS.find(b=>b.key===u.key);
    let part = '';
    if(u.type==='literal') part = typeof def.pattern==='function' ? def.pattern(u.value) : '';
    else if(u.type==='atom') part = (typeof def.pattern === 'function' ? def.pattern(u.value) : def.pattern);
    else if(u.type==='groupOpen' || u.type==='groupClose' || u.type==='alternation' || u.type==='anchorStart' || u.type==='anchorEnd') part = def.pattern;
    else part='';
    if(isColorized(u)) part = `(${part})`;
    if(u.attachedQuant) part = `${part}${u.attachedQuant}`;
    regex += part;
  }
  return regex;
}

function regexWithFlags(rx){
  if(!rx) return '';
  const fl = `${flagsEl.i.checked?'i':''}${flagsEl.m.checked?'m':''}${flagsEl.g.checked?'g':''}`;
  return `/${rx}/${fl}`;
}

function getFlagsString(){
  return `${flagsEl.i.checked?'i':''}${flagsEl.m.checked?'m':''}${flagsEl.g.checked?'g':''}`;
}

function getRegExp(rx){
  if(!rx) return null;
  try{
    return new RegExp(rx, getFlagsString());
  }catch(err){
    validationMsg.textContent = 'Invalid regex: ' + err.message;
    return null;
  }
}

function unitColorIndex(unitOrdinal){
  const colorUnits = sequence.filter(isColorized);
  const u = colorUnits[unitOrdinal];
  return (u && typeof u.colorIndex==='number') ? u.colorIndex : unitOrdinal;
}

function showError(msg){ if(!msg) return; validationMsg.textContent = msg; validationMsg.classList.remove('hidden'); }

// Public API helpers for other modules
export const BuilderAPI = {
  addBlockFromPalette,
  moveBlock,
  render,
  getDropIndex,
  getFlags,
  setExternalRegex(rx){ externalRegex = (rx || rx === '') ? String(rx) : null; render(); },
  clearExternalRegex(){ externalRegex = null; render(); },
  setSequence(seq){ sequence = seq; nextId = (Math.max(0, ...seq.map(u=>u.id))+1) || 1; render(); },
  get sequence(){ return sequence; }
};

// Event bindings for inputs
export function bindCoreEvents(){
  testInput.addEventListener('input', ()=> render());
  Object.values(flagsEl).forEach(el=> el && el.addEventListener('change', ()=> render()));
  const clearBtn = $('#clear-seq');
  if(clearBtn) clearBtn.addEventListener('click', ()=>{ sequence = []; render(); });
  if(presetSelect) presetSelect.addEventListener('change', (e)=>{ /* handled in main to use presets */ });
}
