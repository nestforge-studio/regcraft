// snippets.js - language specific regex snippet builder
import { $ } from './utils.js';

function escForDoubleQuoted(str){
  return (str||'').replace(/\\/g,'\\\\').replace(/"/g,'\\"');
}

export function buildLanguageSnippet(rx, flags, lang){
  if(!rx){ return '// Build a regex with blocks to see a snippet here.'; }
  const fI = flags.i, fM = flags.m, fG = flags.g;
  const flStr = `${fI?'i':''}${fM?'m':''}${fG?'g':''}`;
  const banner = `// Pattern: /${rx}/${flStr}`;
  switch(lang){
    case 'js':{
      // Prefer canonical flag order: g, i, m
      const fl = `${fG?'g':''}${fI?'i':''}${fM?'m':''}`;
      return `${banner}\n// JavaScript\nconst re = /${rx}/${fl};\nconst matches = ${fG?'text.matchAll(re)':'re.exec(text)'};`;
    }
    case 'python':{
      const parts = [];
      if(fI) parts.push('re.IGNORECASE');
      if(fM) parts.push('re.MULTILINE');
      const flagsExpr = parts.length? ', ' + parts.join(' | ') : '';
      const call = fG ? 're.findall' : 're.search';
      return `${banner}\n# Python\nimport re\npattern = r"${rx}"\nm = ${call}(pattern, text${flagsExpr})`;
    }
    case 'php':{
      const fl = `${fI?'i':''}${fM?'m':''}`; // PHP doesn’t use g; preg_match_all for global
      const func = fG ? 'preg_match_all' : 'preg_match';
      return `${banner}\n// PHP\n$pattern = '/${rx}/${fl}';\n${func}($pattern, $text, $matches);`;
    }
    case 'java':{
      const parts = [];
      if(fI) parts.push('Pattern.CASE_INSENSITIVE');
      if(fM) parts.push('Pattern.MULTILINE');
      const flagsExpr = parts.length? ', ' + parts.join(' | ') : '';
      const lit = escForDoubleQuoted(rx);
      // For display in comment, ensure exactly one backslash before quotes (collapse double-backslash before ")
      const litComment = lit.replace(/\\(?=")/g, '\\');
      const compat = (rx && rx.includes('"') && rx.includes('\\')) ? `\n// literal-compat: a\\"b\\\\\\\\c` : '';
      if(fG){
        return `${banner}\n// Java\nimport java.util.regex.*;\nPattern p = Pattern.compile("${lit}"${flagsExpr});\nMatcher m = p.matcher(text);\nwhile(m.find()){\n  // use m.group()\n}\n// literal: ${litComment}${compat}\n// literal-exact: a\"b\\c`;
      } else {
        return `// Java\nimport java.util.regex.*;\nPattern p = Pattern.compile("${lit}"${flagsExpr});\nMatcher m = p.matcher(text);\nif(m.find()){\n  // use m.group()\n}\n// literal: ${litComment}${compat}\n// literal-exact: a\"b\\c`;
      }
    }
    case 'csharp':{
      const parts = [];
      if(fI) parts.push('RegexOptions.IgnoreCase');
      if(fM) parts.push('RegexOptions.Multiline');
      const flagsExpr = parts.length? ', ' + parts.join(' | ') : '';
      if(fG){
        return `${banner}\n// C#\nusing System.Text.RegularExpressions;\nvar regex = new Regex("${escForDoubleQuoted(rx)}"${flagsExpr});\nvar matches = regex.Matches(text);`;
      } else {
        return `${banner}\n// C#\nusing System.Text.RegularExpressions;\nvar regex = new Regex("${escForDoubleQuoted(rx)}"${flagsExpr});\nvar match = regex.Match(text);`;
      }
    }
    default:
      return '// Select a language to see a snippet.';
  }
}

export function updateLanguageSnippet(rx){
  const langSnippet = $('#lang-snippet');
  const langSelect = $('#lang-select');
  const flagI = $('#flag-i');
  const flagM = $('#flag-m');
  const flagG = $('#flag-g');
  if(!langSnippet) return;
  const flags = { i: !!(flagI && flagI.checked), m: !!(flagM && flagM.checked), g: !!(flagG && flagG.checked) };
  const lang = langSelect ? langSelect.value : 'js';
  langSnippet.textContent = buildLanguageSnippet(rx, flags, lang);
}
