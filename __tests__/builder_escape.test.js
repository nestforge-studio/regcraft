// Tests for literal escaping in builder

function setupDOM() {
  document.body.innerHTML = `
  <input id="flag-i" type="checkbox" />
  <input id="flag-m" type="checkbox" />
  <input id="flag-g" type="checkbox" />
  <div id="palette"></div>
  <div id="canvas"></div>
  <code id="regex-output"></code>
  <div id="validation-msg"></div>
  <textarea id="test-input"></textarea>
  <select id="lang-select"></select>
  <code id="lang-snippet"></code>
  <div id="highlight-output"></div>
  <div id="inline-output"></div>
  <button id="clear-seq"></button>
  <select id="preset-select"></select>
  `;
}

describe('Builder literal escaping', () => {
  test('literal "a.b" becomes a\\.b in regex', async () => {
    setupDOM();
    const builder = await import('../js/modules/builder.js');

    // Uncheck all flags to simplify
    document.getElementById('flag-i').checked = false;
    document.getElementById('flag-m').checked = false;
    document.getElementById('flag-g').checked = false;

    const seq = [
      {id:1, key:'lit', type:'literal', value:'a.b', colorIndex:0}
    ];
    builder.BuilderAPI.setSequence(seq);

    const out = document.getElementById('regex-output').textContent;
    // Should be like /(a\.b)/ with no flags
    expect(out).toMatch(/^\/\(a\\\.b\)\/$/);
  });
});
