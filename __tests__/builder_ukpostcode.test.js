// Tests for Builder + UK Postcode preset integration

// Build a minimal DOM skeleton that builder.js expects on import
function setupDOM() {
  document.body.innerHTML = `
  <header>
    <input id="flag-i" type="checkbox" />
    <input id="flag-m" type="checkbox" />
    <input id="flag-g" type="checkbox" checked />
    <button id="theme-toggle"></button>
  </header>
  <main>
    <div id="palette"></div>
    <div id="canvas"></div>
    <code id="regex-output"></code>
    <div id="validation-msg"></div>
    <textarea id="test-input"></textarea>
    <select id="preset-select"></select>
    <select id="lang-select"></select>
    <code id="lang-snippet"></code>
    <div id="highlight-output"></div>
    <div id="inline-output"></div>
  </main>`;
}

describe('Builder + UK Postcode preset end-to-end', () => {
  test('selecting ukpostcode and testing text highlights WN2 5EB', async () => {
    setupDOM();
    // Import ESM modules dynamically after DOM exists
    const builder = await import('../js/modules/builder.js');
    const presets = await import('../js/modules/presets.js');

    // Apply the UK postcode preset
    presets.applyPreset('ukpostcode', (seq) => builder.BuilderAPI.setSequence(seq));

    // Provide test input
    const testInput = document.getElementById('test-input');
    testInput.value = 'Where do you live? I live in WN2 5EB.';

    // Ensure global flag is on for multiple matches behavior (already checked by default)
    const flagG = document.getElementById('flag-g');
    flagG.checked = true;

    // Trigger render explicitly
    builder.BuilderAPI.render();

    // Check regex output doesn’t include anchors (preset intentionally without ^/$)
    const regexOut = document.getElementById('regex-output').textContent;
    expect(regexOut).toMatch(/\/\//); // looks like /.../g
    expect(regexOut).not.toMatch(/^\/\^/); // not starting with ^
    expect(regexOut).not.toMatch(/\$\//); // not ending with $

    // Highlighted matches should contain the postcode
    const highlight = document.getElementById('highlight-output');
    expect(highlight.textContent).toContain('WN2 5EB');

    // Inline output should also contain the highlighted postcode text
    const inline = document.getElementById('inline-output');
    expect(inline.textContent).toContain('WN2 5EB');
  });
});
