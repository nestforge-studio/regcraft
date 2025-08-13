// theme.js - dark/light theme handling
import { $ } from './utils.js';

export function initTheme(){
  const root = document.documentElement;
  const saved = localStorage.getItem('regcraft-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const wantDark = saved ? saved === 'dark' : prefersDark;
  root.classList.toggle('dark', wantDark);
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if(themeColor) themeColor.setAttribute('content', wantDark ? '#0b1220' : '#0ea5e9');
}

export function bindThemeToggle(){
  const btn = $('#theme-toggle');
  if(!btn) return;
  btn.addEventListener('click', ()=>{
    const root = document.documentElement;
    const nowDark = !root.classList.contains('dark');
    root.classList.toggle('dark', nowDark);
    localStorage.setItem('regcraft-theme', nowDark ? 'dark' : 'light');
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if(themeColor) themeColor.setAttribute('content', nowDark ? '#0b1220' : '#0ea5e9');
  });
}
