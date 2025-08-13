// Tests for highlight module using Date recipe behavior

function setupDOM() {
  document.body.innerHTML = `
  <div id="highlight-output"></div>
  <div id="inline-output"></div>
  `;
}

describe('Highlight module - Date YYYY-MM-DD', () => {
  test('finds and lists 2025-09-07 and highlights inline', async () => {
    setupDOM();
    const highlightMod = await import('../js/modules/highlight.js');
    const presets = await import('../js/modules/presets.js');

    // Build sequence via preset (modular preset has no anchors for date)
    let seq = [];
    presets.applyPreset('date', (s)=>{ seq = s; });

    const text = "Today's Date is: 2025-09-07";

    // Build a regex from the sequence similar to builder (colorized wrapping isn't necessary for this test)
    // We can emulate the final regex string simply as \d{4}-\d{2}-\d{2}
    const rx = "\\d{4}-\\d{2}-\\d{2}";

    // Provide helpers and flags expected by highlight()
    const helpers = {
      getRegExp: (r)=> new RegExp(r, 'g'),
      unitColorIndex: (i)=> i,
      isColorized: (u)=> u && (u.type==='atom' || u.type==='literal' || u.type==='groupOpen')
    };
    const flags = { g: true };

    highlightMod.highlight(text, rx, seq, flags, helpers);

    const highlight = document.getElementById('highlight-output');
    const inline = document.getElementById('inline-output');

    expect(highlight.textContent).toContain('2025-09-07');
    expect(inline.textContent).toContain('2025-09-07');
  });
});
