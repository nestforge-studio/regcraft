// constants.js - COLORS and BLOCKS catalog
import { escapeRegex } from './utils.js';

export const COLORS = [
  'bg-rose-100 text-rose-900 border-rose-300',
  'bg-amber-100 text-amber-900 border-amber-300',
  'bg-emerald-100 text-emerald-900 border-emerald-300',
  'bg-sky-100 text-sky-900 border-sky-300',
  'bg-violet-100 text-violet-900 border-violet-300',
  'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300',
  'bg-lime-100 text-lime-900 border-lime-300',
  'bg-cyan-100 text-cyan-900 border-cyan-300',
  'bg-orange-100 text-orange-900 border-orange-300',
];

export const BLOCKS = [
  { key:'^', label:'Start ^', type:'anchorStart', pattern:'^', colorless:true, desc:'Anchors the match at the start of the string (or line with /m).' },
  { key:'$', label:'End $', type:'anchorEnd', pattern:'$', colorless:true, desc:'Anchors the match at the end of the string (or line with /m).' },

  { key:'lit', label:'Literal', type:'literal', pattern:(v)=>escapeRegex(v||''), input:'text', placeholder:'text', desc:'Matches the exact text you enter, escaping regex special characters.' },
  { key:'any', label:'Any .', type:'atom', pattern:'.', desc:'Matches any single character except newline (dot).' },
  { key:'digit', label:'Digit \\d', type:'atom', pattern:'\\d', desc:'Matches a digit character [0-9].' },
  { key:'word', label:'Word \\w', type:'atom', pattern:'\\w', desc:'Matches a word character [A-Za-z0-9_].' },
  { key:'space', label:'Space \\s', type:'atom', pattern:'\\s', desc:'Matches a whitespace character (space, tab, newline, etc.).' },
  { key:'class', label:'Class [..]', type:'atom', pattern:(v)=>`[${v||''}]`, input:'text', placeholder:'abc0-9', desc:'Matches one character from the set/range you type, e.g. abc0-9.' },

  { key:'grpOpen', label:'Group (', type:'groupOpen', pattern:'(', desc:'Opens a capturing group to group sub-patterns.' },
  { key:'grpClose', label:'Group )', type:'groupClose', pattern:')', desc:'Closes a capturing group.' },
  { key:'alt', label:'Or |', type:'alternation', pattern:'|', desc:'Alternation (OR) between left and right parts.' },

  { key:'plus', label:'One+','type':'quant', pattern:'+', desc:'Quantifier: one or more of the preceding token.' },
  { key:'star', label:'Zero*','type':'quant', pattern:'*', desc:'Quantifier: zero or more of the preceding token.' },
  { key:'opt', label:'Opt?','type':'quant', pattern:'?', desc:'Quantifier: zero or one of the preceding token.' },
  { key:'exact', label:'Exactly {n}','type':'quantParam', pattern:(n)=>`{${n}}`, input:'number', placeholder:'n', desc:'Quantifier: exactly n repetitions.' },
  { key:'atleast', label:'At least {n,}','type':'quantParam', pattern:(n)=>`{${n},}`, input:'number', placeholder:'n', desc:'Quantifier: at least n repetitions.' },
  { key:'range', label:'Range {m,n}','type':'quantRange', pattern:(m,n)=>`{${m},${n}}`, input:'range', placeholder:'m,n', desc:'Quantifier: between m and n repetitions.' }
];
