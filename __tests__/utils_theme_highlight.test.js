// Tests to cover utils, theme, and additional highlight branches

function setupBasicDOM() {
  document.body.innerHTML = `
    <meta name="theme-color" content="#0ea5e9" />
    <button id="theme-toggle"></button>
    <div id="highlight-output"></div>
    <div id="inline-output"></div>
  `;
}

describe('utils.js helpers', () => {
  test('escapeRegex escapes metacharacters', async () => {
    const { escapeRegex } = await import('../js/modules/utils.js');
    const src = '.*+?^${}()|[]\\';
    const escaped = escapeRegex(src);
    // Every metacharacter must be escaped with a backslash
    expect(escaped).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
  });

  test('$ and $$ select elements', async () => {
    const utils = await import('../js/modules/utils.js');
    document.body.innerHTML = '<div class="a"></div><div class="a"></div>';
    const one = utils.$('.a');
    const many = utils.$$('.a');
    expect(one).not.toBeNull();
    expect(Array.isArray(many)).toBe(true);
    expect(many.length).toBe(2);
  });

  test('textNode creates a text node', async () => {
    const { textNode } = await import('../js/modules/utils.js');
    const n = textNode('hello');
    expect(n.nodeType).toBe(Node.TEXT_NODE);
    expect(n.textContent).toBe('hello');
  });
});

describe('theme.js behavior', () => {
  test('initTheme uses localStorage and toggles meta theme-color', async () => {
    setupBasicDOM();
    const { initTheme } = await import('../js/modules/theme.js');
    // Force light first
    localStorage.setItem('regcraft-theme', 'light');
    initTheme();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta.getAttribute('content')).toBe('#0ea5e9');

    // Now set dark and re-init
    localStorage.setItem('regcraft-theme', 'dark');
    initTheme();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(meta.getAttribute('content')).toBe('#0b1220');
  });

  test('bindThemeToggle toggles class and persists', async () => {
    setupBasicDOM();
    const theme = await import('../js/modules/theme.js');
    // Ensure starts light
    document.documentElement.classList.remove('dark');
    localStorage.setItem('regcraft-theme', 'light');

    theme.bindThemeToggle();
    document.getElementById('theme-toggle').click();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('regcraft-theme')).toBe('dark');
    document.getElementById('theme-toggle').click();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('regcraft-theme')).toBe('light');
  });
});

describe('highlight.js edge cases', () => {
  test('countTopLevelGroups counts colorized units', async () => {
    const { countTopLevelGroups } = await import('../js/modules/highlight.js');
    const seq = [
      {type:'atom'}, {type:'literal'}, {type:'groupOpen'}, {type:'anchorStart'}
    ];
    const isColorized = (u)=> u && (u.type==='atom' || u.type==='literal' || u.type==='groupOpen');
    expect(countTopLevelGroups(seq, isColorized)).toBe(3);
  });
  test('coloredSpan wraps text with a color class', async () => {
    const { coloredSpan } = await import('../js/modules/highlight.js');
    const el = coloredSpan('txt', 'c1');
    expect(el.textContent).toBe('txt');
    expect(el.className).toContain('c1');
  });

  test('highlightMatchesByGroups splits groups into colored spans', async () => {
    const mod = await import('../js/modules/highlight.js');
    const re = /(a)(b)/g;
    const nodes = mod.highlightMatchesByGroups('ab ab', re, 2, (i)=>i, { g: true });
    expect(nodes.length).toBe(2);
    // flatten text content
    expect(nodes[0].textContent).toBe('ab');
  });

  test('highlightInlineSimple handles zero-length matches and advances lastIndex', async () => {
    const mod = await import('../js/modules/highlight.js');
    // Regex with zero-length matches: /(?:)/g matches at every position including end
    const re = /(?:)/g;
    const nodes = mod.highlightInlineSimple('ab', re, { g: true });
    // It should produce interleaved colored spans and text nodes; importantly it should finish
    expect(nodes.length).toBeGreaterThan(0);
  });

  test('highlight yields "No matches" when none found', async () => {
    setupBasicDOM();
    const mod = await import('../js/modules/highlight.js');
    const helpers = { getRegExp: (r)=> new RegExp(r, 'g'), unitColorIndex: (i)=> i, isColorized: ()=>true };
    mod.highlight('abc', 'z+', [], { g: true }, helpers);
    expect(document.getElementById('highlight-output').textContent).toMatch(/No matches/i);
    // inline output should be original text since nothing matched
    expect(document.getElementById('inline-output').textContent).toBe('abc');
  });
});
