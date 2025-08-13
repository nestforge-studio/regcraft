// Tests for builder external regex override and additional validation branches

function setupDOM() {
  document.body.innerHTML = `
  <input id="flag-i" type="checkbox" />
  <input id="flag-m" type="checkbox" />
  <input id="flag-g" type="checkbox" checked />
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

describe('Builder API external regex override', () => {
  test('setExternalRegex shows raw regex and clears validation', async () => {
    setupDOM();
    const { BuilderAPI } = await import('../js/modules/builder.js');
    // Put an invalid sequence to have a validation error first
    const badSeq = [ {id:1, key:'alt', type:'alternation'} ];
    BuilderAPI.setSequence(badSeq);
    expect(document.getElementById('validation-msg').textContent).toMatch(/cannot be first/i);

    // Now override with a free text regex and ensure validation cleared
    BuilderAPI.setExternalRegex('foo+');
    const out = document.getElementById('regex-output').textContent;
    expect(out).toMatch(/\/foo\+/);
    expect(document.getElementById('validation-msg').textContent).toBe('');

    // Clearing external should go back to validating the invalid sequence
    BuilderAPI.clearExternalRegex();
    expect(document.getElementById('validation-msg').textContent).toMatch(/cannot be first/i);
  });
});

describe('Builder additional validation branches', () => {
  test('^ not at start and $ not at end produce messages', async () => {
    setupDOM();
    const { BuilderAPI } = await import('../js/modules/builder.js');
    const seq = [
      {id:1, key:'lit', type:'literal', value:'A'},
      {id:2, key:'^', type:'anchorStart'},
      {id:3, key:'$', type:'anchorEnd'},
      {id:4, key:'lit', type:'literal', value:'B'}
    ];
    BuilderAPI.setSequence(seq);
    const msg = document.getElementById('validation-msg').textContent;
    expect(msg).toMatch(/\^ must be at the start|\$ must be at the end/);
  });

  test('sequence cannot end with | or (', async () => {
    setupDOM();
    const { BuilderAPI } = await import('../js/modules/builder.js');
    const seq = [
      {id:1, key:'grpOpen', type:'groupOpen'},
      {id:2, key:'digit', type:'atom'}
    ];
    // Close group missing -> unmatched (, already covered, but now end with |
    seq.push({id:3, key:'alt', type:'alternation'});
    BuilderAPI.setSequence(seq);
    expect(document.getElementById('validation-msg').textContent).toMatch(/cannot end with \| or \(/i);
  });

  test('quantifier without target shows error via addBlockFromPalette', async () => {
    setupDOM();
    const builder = await import('../js/modules/builder.js');
    const { BLOCKS } = await import('../js/modules/constants.js');
    const plus = BLOCKS.find(b=> b.key==='plus');
    builder.BuilderAPI.addBlockFromPalette(plus, 0);
    expect(document.getElementById('validation-msg').textContent).toMatch(/must follow something to quantify/i);
  });
});
