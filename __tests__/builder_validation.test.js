// Tests for validation messages via builder

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

describe('Builder validation', () => {
  test('alternation cannot be first', async () => {
    setupDOM();
    const builder = await import('../js/modules/builder.js');

    const badSeq = [
      {id:1, key:'alt', type:'alternation'}
    ];
    builder.BuilderAPI.setSequence(badSeq);

    const msg = document.getElementById('validation-msg').textContent;
    expect(msg).toMatch(/cannot be first or last/i);
  });

  test('unmatched parenthesis detected', async () => {
    setupDOM();
    const builder = await import('../js/modules/builder.js');

    const badSeq = [
      {id:1, key:'grpOpen', type:'groupOpen'},
      {id:2, key:'digit', type:'atom'}
    ];
    builder.BuilderAPI.setSequence(badSeq);

    const msg = document.getElementById('validation-msg').textContent;
    expect(msg).toMatch(/unmatched \( detected/i);
  });
});
