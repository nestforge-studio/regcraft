// Anchored tests for recipes: wrap preset sequences with ^ and $

function setupDOM(){
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

async function applyAnchoredPreset(key, exactText){
  const builder = await import('../js/modules/builder.js');
  const presets = await import('../js/modules/presets.js');
  let seq = [];
  presets.applyPreset(key, (s)=>{ seq = s; });
  // Wrap with anchors
  let nextId = (Math.max(0, ...seq.map(u=>u.id))+1) || 1;
  const anchored = [ {id: ++nextId, key:'^', type:'anchorStart'}, ...seq, {id: ++nextId, key:'$', type:'anchorEnd'} ];
  builder.BuilderAPI.setSequence(anchored);
  const testInput = document.getElementById('test-input');
  testInput.value = exactText;
  builder.BuilderAPI.render();
  return { builder };
}

describe('Anchored recipes (match complete string)', () => {
  test('UUID exact value', async () => {
    setupDOM();
    const value = '550e8400-e29b-41d4-a716-446655440000';
    await applyAnchoredPreset('uuid', value);
    expect(document.getElementById('highlight-output').textContent).toContain(value);
  });

  test('US phone exact value', async () => {
    setupDOM();
    const value = '(123) 456-7890';
    await applyAnchoredPreset('usphone', value);
    const txt = document.getElementById('highlight-output').textContent;
    expect(txt).toContain('123');
    expect(txt).toContain('7890');
  });

  test('Credit card strict exact (Visa)', async () => {
    setupDOM();
    const value = '4111111111111111';
    await applyAnchoredPreset('creditcard_strict', value);
    expect(document.getElementById('highlight-output').textContent).toContain(value);
  });

  test('Credit card strict exact (MasterCard)', async () => {
    setupDOM();
    const value = '5555555555554444';
    await applyAnchoredPreset('creditcard_strict', value);
    expect(document.getElementById('highlight-output').textContent).toContain(value);
  });

  test('Credit card strict exact (Amex)', async () => {
    setupDOM();
    const value = '371449635398431';
    await applyAnchoredPreset('creditcard_strict', value);
    expect(document.getElementById('highlight-output').textContent).toContain(value);
  });

  test('Slug exact value', async () => {
    setupDOM();
    const value = 'my-post-title';
    await applyAnchoredPreset('slug', value);
    expect(document.getElementById('highlight-output').textContent).toContain(value);
  });

  test('MAC exact value', async () => {
    setupDOM();
    const value = '01:23:45:67:89:ab';
    await applyAnchoredPreset('mac', value);
    expect(document.getElementById('highlight-output').textContent).toContain(value);
  });

  test('SemVer exact value', async () => {
    setupDOM();
    const value = '1.2.3';
    await applyAnchoredPreset('semver', value);
    expect(document.getElementById('highlight-output').textContent).toContain(value);
  });

  test('ISO8601 exact value', async () => {
    setupDOM();
    const value = '2025-09-07T12:34:56';
    await applyAnchoredPreset('iso8601', value);
    expect(document.getElementById('highlight-output').textContent).toContain(value);
  });

  test('Date YYYY-MM-DD exact value', async () => {
    setupDOM();
    const value = '2025-09-07';
    await applyAnchoredPreset('date', value);
    expect(document.getElementById('highlight-output').textContent).toContain(value);
  });

  test('Email simplified exact value', async () => {
    setupDOM();
    const value = 'foo@bar.com';
    await applyAnchoredPreset('email', value);
    expect(document.getElementById('highlight-output').textContent).toContain(value);
  });

  test('URL basic exact value', async () => {
    setupDOM();
    const value = 'https://example.com';
    await applyAnchoredPreset('url', value);
    const txt = document.getElementById('highlight-output').textContent;
    expect(txt).toContain('https://example.com');
  });

  test('IPv4 simplified exact value', async () => {
    setupDOM();
    const value = '10.0.0.1';
    await applyAnchoredPreset('ipv4', value);
    expect(document.getElementById('highlight-output').textContent).toContain(value);
  });

  test('Hex color exact value (#fff)', async () => {
    setupDOM();
    const value = '#fff';
    await applyAnchoredPreset('hexcolor', value);
    const txt = document.getElementById('highlight-output').textContent;
    expect(txt.includes('#fff') || txt.includes('#FFF')).toBe(true);
  });

  test('UK postcode strict-ish exact value', async () => {
    setupDOM();
    const value = 'WN2 5EB';
    await applyAnchoredPreset('ukpostcode', value);
    expect(document.getElementById('highlight-output').textContent).toContain(value);
  });

  test('UK NINO exact (spaced)', async () => {
    setupDOM();
    const value = 'AB 12 34 56 C';
    await applyAnchoredPreset('nino', value);
    expect(document.getElementById('highlight-output').textContent).toContain('AB 12 34 56 C');
  });

  test('UK NINO exact (compact)', async () => {
    setupDOM();
    const value = 'AB123456C';
    await applyAnchoredPreset('nino', value);
    expect(document.getElementById('highlight-output').textContent).toContain('AB123456C');
  });

  test('US SSN exact', async () => {
    setupDOM();
    const value = '123-45-6789';
    await applyAnchoredPreset('ssn', value);
    expect(document.getElementById('highlight-output').textContent).toContain('123-45-6789');
  });
});
