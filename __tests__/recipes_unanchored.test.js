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

describe('Unanchored recipes highlight inside text', () => {
  test('URL inside text', async () => {
    setupDOM();
    const builder = await import('../js/modules/builder.js');
    const presets = await import('../js/modules/presets.js');
    presets.applyPreset('url', (seq)=> builder.BuilderAPI.setSequence(seq));
    const testInput = document.getElementById('test-input');
    testInput.value = 'Visit https://example.com/docs today';
    builder.BuilderAPI.render();
    expect(document.getElementById('highlight-output').textContent).toContain('https://example.com');
  });

  test('IPv4 inside text', async () => {
    setupDOM();
    const builder = await import('../js/modules/builder.js');
    const presets = await import('../js/modules/presets.js');
    presets.applyPreset('ipv4', (seq)=> builder.BuilderAPI.setSequence(seq));
    const testInput = document.getElementById('test-input');
    testInput.value = 'Ping 10.0.0.1 now';
    builder.BuilderAPI.render();
    expect(document.getElementById('highlight-output').textContent).toContain('10.0.0.1');
  });

  test('Hex color inside text', async () => {
    setupDOM();
    const builder = await import('../js/modules/builder.js');
    const presets = await import('../js/modules/presets.js');
    presets.applyPreset('hexcolor', (seq)=> builder.BuilderAPI.setSequence(seq));
    const testInput = document.getElementById('test-input');
    testInput.value = 'Primary is #A1B2C3 and secondary is #fff';
    builder.BuilderAPI.render();
    const txt = document.getElementById('highlight-output').textContent;
    expect(txt.includes('#A1B2C3') || txt.includes('#fff')).toBe(true);
  });

  test('UK NINO inside text (valid AB 12 34 56 C)', async () => {
    setupDOM();
    const builder = await import('../js/modules/builder.js');
    const presets = await import('../js/modules/presets.js');
    presets.applyPreset('nino', (seq)=> builder.BuilderAPI.setSequence(seq));
    const testInput = document.getElementById('test-input');
    testInput.value = 'My NINO is AB 12 34 56 C';
    builder.BuilderAPI.render();
    expect(document.getElementById('highlight-output').textContent).toContain('AB 12 34 56 C');
  });

  test('UK NINO compact form inside text (valid AB123456C)', async () => {
    setupDOM();
    const builder = await import('../js/modules/builder.js');
    const presets = await import('../js/modules/presets.js');
    presets.applyPreset('nino', (seq)=> builder.BuilderAPI.setSequence(seq));
    const testInput = document.getElementById('test-input');
    testInput.value = 'My NINO is AB123456C';
    builder.BuilderAPI.render();
    expect(document.getElementById('highlight-output').textContent).toContain('AB123456C');
  });

  test('US SSN inside text', async () => {
    setupDOM();
    const builder = await import('../js/modules/builder.js');
    const presets = await import('../js/modules/presets.js');
    presets.applyPreset('ssn', (seq)=> builder.BuilderAPI.setSequence(seq));
    const testInput = document.getElementById('test-input');
    testInput.value = 'My SSN is 123-45-6789';
    builder.BuilderAPI.render();
    expect(document.getElementById('highlight-output').textContent).toContain('123-45-6789');
  });
  test('UK postcode formatted variants inside text', async () => {
    setupDOM();
    const builder = await import('../js/modules/builder.js');
    const presets = await import('../js/modules/presets.js');
    presets.applyPreset('ukpostcode_formats', (seq)=> builder.BuilderAPI.setSequence(seq));
    const testInput = document.getElementById('test-input');
    testInput.value = 'I lived at M1 1AE before, now at EC1A 1BB and sometimes W1A 0AX';
    builder.BuilderAPI.render();
    const txt = document.getElementById('highlight-output').textContent;
    expect(txt).toContain('M1 1AE');
    expect(txt).toContain('EC1A 1BB');
    expect(txt).toContain('W1A 0AX');
  });

  test('Credit card strict (Visa/MasterCard/Amex) inside text', async () => {
    setupDOM();
    const builder = await import('../js/modules/builder.js');
    const presets = await import('../js/modules/presets.js');
    presets.applyPreset('creditcard_strict', (seq)=> builder.BuilderAPI.setSequence(seq));
    const testInput = document.getElementById('test-input');
    testInput.value = 'Cards: 4111111111111111, 5555555555554444, 371449635398431';
    builder.BuilderAPI.render();
    const txt = document.getElementById('highlight-output').textContent;
    expect(txt).toMatch(/4111/);
    expect(txt).toMatch(/5555/);
    expect(txt).toMatch(/3714/);
  });

  test('UK NINO excludes invalid prefixes like QQ', async () => {
    setupDOM();
    const builder = await import('../js/modules/builder.js');
    const presets = await import('../js/modules/presets.js');
    presets.applyPreset('nino', (seq)=> builder.BuilderAPI.setSequence(seq));
    const testInput = document.getElementById('test-input');
    testInput.value = 'My NINO is QQ 12 34 56 A';
    builder.BuilderAPI.render();
    expect(document.getElementById('highlight-output').textContent).not.toContain('QQ 12 34 56 A');
  });
});
