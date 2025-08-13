// main.js - entry point wiring modules together
import { $ } from './modules/utils.js';
import { initTheme, bindThemeToggle } from './modules/theme.js';
import { initPalette, bindDnd, bindCoreEvents, BuilderAPI } from './modules/builder.js';
import { PRESETS, applyPreset } from './modules/presets.js';
import { updateLanguageSnippet } from './modules/snippets.js';

// Initialize theme first
initTheme();
bindThemeToggle();

// Initialize palette and builder canvas interactions
initPalette();
bindDnd();
bindCoreEvents();

// Language select and copy snippet button behavior (snippet updates handled by render)
const langSelect = $('#lang-select');
if(langSelect) langSelect.addEventListener('change', ()=>{
  // Re-render to refresh snippet
  BuilderAPI.render();
});
const copySnippetBtn = $('#copy-snippet');
if(copySnippetBtn){
  copySnippetBtn.addEventListener('click', ()=>{
    const snippetEl = $('#lang-snippet');
    const txt = snippetEl ? snippetEl.textContent : '';
    if(txt && navigator.clipboard){ navigator.clipboard.writeText(txt); }
  });
}
const copyRegexBtn = $('#copy-regex');
if(copyRegexBtn){
  copyRegexBtn.addEventListener('click', ()=>{
    const rxEl = $('#regex-output');
    const txt = rxEl ? rxEl.textContent : '';
    if(txt && navigator.clipboard){ navigator.clipboard.writeText(txt); }
  });
}

// Presets dropdown (for tests and harness pages that include it)
const presetSelect = $('#preset-select');
if(presetSelect){
  presetSelect.addEventListener('change', (e)=>{
    const key = e.target.value;
    applyPreset(key, (seq)=> BuilderAPI.setSequence(seq));
  });
}

// Populate Recipes tab with preset buttons
(function populateRecipes(){
  const list = document.getElementById('recipes-list');
  if(!list) return;
  list.innerHTML = '';
  const keys = Object.keys(PRESETS).sort();
  for(const key of keys){
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'text-left text-sm border rounded px-2 py-1 hover:bg-slate-50 active:scale-[.98]';
    btn.dataset.preset = key;
    const label = key.replace(/_/g,' ').replace(/\b\w/g, c=>c.toUpperCase());
    btn.textContent = label;
    btn.addEventListener('click', ()=> applyPreset(key, (seq)=> BuilderAPI.setSequence(seq)));
    list.appendChild(btn);
  }
})();

// Left panel tabs: Blocks / Recipes / Free Text
const paletteSection = document.getElementById('palette-section');
const recipesSection = document.getElementById('recipes-section');
const freetextSection = document.getElementById('freetext-section');
const freeTextInput = document.getElementById('freetext-input');
const tabBtns = Array.from(document.querySelectorAll('.tab-btn[data-view]'));
let currentView = 'blocks';
function setSideView(view){
  currentView = view;
  const showBlocks = (view === 'blocks');
  const showRecipes = (view === 'recipes');
  const showFree = (view === 'freetext');
  if(paletteSection){ paletteSection.classList.toggle('hidden', !showBlocks); }
  if(recipesSection){ recipesSection.classList.toggle('hidden', !showRecipes); }
  if(freetextSection){ freetextSection.classList.toggle('hidden', !showFree); }
  if(showFree){
    const val = freeTextInput ? freeTextInput.value : '';
    BuilderAPI.setExternalRegex(val || '');
  } else {
    BuilderAPI.clearExternalRegex();
  }
  tabBtns.forEach(btn => {
    const active = btn.dataset.view === view;
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
    btn.classList.toggle('font-medium', active);
  });
}
if(tabBtns.length){
  tabBtns.forEach(btn=> btn.addEventListener('click', ()=> setSideView(btn.dataset.view)));
  // Initialize to "blocks"
  setSideView('blocks');
}
if(freeTextInput){
  freeTextInput.addEventListener('input', () => {
    if(currentView === 'freetext'){
      BuilderAPI.setExternalRegex(freeTextInput.value || '');
    }
  });
}

// Initialize with a simple example
let nextId = 1;
const initial = [
  {id:nextId++, key:'^', type:'anchorStart'},
  {id:nextId++, key:'lit', type:'literal', value:'Hello', colorIndex:0},
  {id:nextId++, key:'space', type:'atom', colorIndex:1},
  {id:nextId++, key:'word', type:'atom', colorIndex:2, attachedQuant:'+'},
  {id:nextId++, key:'$', type:'anchorEnd'}
];
BuilderAPI.setSequence(initial);
