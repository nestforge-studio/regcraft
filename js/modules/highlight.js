// highlight.js - matching/highlight rendering
import { $, textNode } from './utils.js';
import { COLORS } from './constants.js';

export function coloredSpan(textContent, colorClass){
  const span = document.createElement('span');
  span.className = `inline rounded px-1 ${colorClass}`;
  span.textContent = textContent;
  return span;
}

export function countTopLevelGroups(sequence, isColorized){
  return sequence.filter(isColorized).length;
}

export function highlight(text, rx, sequence, flags, helpers){
  // helpers: { getRegExp, unitColorIndex, isColorized }
  const highlightOut = $('#highlight-output');
  const inlineOut = $('#inline-output');

  highlightOut.innerHTML = '';
  if(!text){ if(inlineOut){ inlineOut.textContent=''; } return; }
  const re = helpers.getRegExp(rx);
  if(!re){ if(inlineOut){ inlineOut.textContent=''; } return; }

  const container = document.createElement('div');

  // Always list full matches in the matches panel for clarity
  const nodes = highlightMatchesSimple(text, re, flags);

  if(nodes.length === 0){
    const empty = document.createElement('div');
    empty.className = 'text-slate-500 dark:text-slate-400 text-sm';
    empty.textContent = 'No matches';
    container.appendChild(empty);
  } else {
    for(const n of nodes) container.appendChild(n);
  }
  highlightOut.appendChild(container);

  if(inlineOut){
    inlineOut.innerHTML = '';
    const nodesInline = highlightInlineSimple(text, re, flags);
    for(const n of nodesInline) inlineOut.appendChild(n);
  }
}

export function highlightMatchesSimple(text, re, flags){
  const result = [];
  re.lastIndex = 0;
  let m;
  const color = COLORS[0];
  while((m = re.exec(text))){
    const row = document.createElement('div');
    row.className = 'mb-1';
    row.appendChild(coloredSpan(m[0], color));
    result.push(row);
    if(m[0].length===0){ re.lastIndex++; }
    if(!flags.g) break;
  }
  return result;
}

export function highlightMatchesByGroups(text, re, groupCount, unitColorIndex, flags){
  const result = [];
  re.lastIndex = 0;
  let m;
  while((m = re.exec(text))){
    const row = document.createElement('div');
    row.className = 'mb-1';
    let pos = 0;
    const matched = m[0];
    let anyPiece = false;
    for(let gi=1; gi<=groupCount; gi++){
      const piece = m[gi];
      if(piece==null) continue;
      const idx = matched.indexOf(piece, pos);
      if(idx>-1){
        const unitIdx = gi-1;
        const color = COLORS[(unitColorIndex(unitIdx)) % COLORS.length];
        row.appendChild(coloredSpan(piece, color));
        anyPiece = true;
        pos = idx + piece.length;
      }
    }
    if(!anyPiece){ row.appendChild(coloredSpan(m[0], COLORS[0])); }
    result.push(row);

    if(m[0].length===0){ re.lastIndex++; }
    if(!flags.g) break;
  }
  return result;
}

export function highlightInlineSimple(text, re, flags){
  const result = [];
  let lastIndex = 0;
  re.lastIndex = 0;
  let m;
  const color = COLORS[0];
  while((m = re.exec(text))){
    const start = m.index;
    const end = m.index + m[0].length;
    if(start>lastIndex){ result.push(textNode(text.slice(lastIndex, start))); }
    result.push(coloredSpan(m[0], color));
    lastIndex = end;
    if(m[0].length===0){ re.lastIndex++; }
    if(!flags.g) break;
  }
  if(lastIndex<text.length){ result.push(textNode(text.slice(lastIndex))); }
  return result;
}
