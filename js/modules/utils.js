// utils.js - general helpers
export const $ = (sel, root=document) => root.querySelector(sel);
export const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
export const escapeRegex = (s) => (s||'').replace(/[.*+?^${}()|[\]\\]/g, r => '\\' + r);

export function textNode(t){ return document.createTextNode(t); }
