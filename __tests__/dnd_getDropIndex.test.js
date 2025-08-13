// Tests for getDropIndex with mocked chip rectangles

function setupDOM() {
  document.body.innerHTML = `
  <div id="canvas"></div>
  <input id="flag-i" type="checkbox" />
  <input id="flag-m" type="checkbox" />
  <input id="flag-g" type="checkbox" />
  <div id="regex-output"></div>
  <div id="validation-msg"></div>
  <textarea id="test-input"></textarea>
  <div id="highlight-output"></div>
  <div id="inline-output"></div>
  <div id="palette"></div>
  <select id="lang-select"></select>
  <code id="lang-snippet"></code>
  <button id="clear-seq"></button>
  <select id="preset-select"></select>
  `;
}

function mockChip(index, rect) {
  const chip = document.createElement('div');
  chip.setAttribute('data-chip', '');
  chip.setAttribute('data-index', String(index));
  chip.getBoundingClientRect = () => ({
    left: rect.left,
    right: rect.left + rect.width,
    top: rect.top,
    bottom: rect.top + rect.height,
    width: rect.width,
    height: rect.height
  });
  return chip;
}

describe('Drag-and-drop getDropIndex', () => {
  test('returns end index when pointing to the right of last chip', async () => {
    setupDOM();
    const builder = await import('../js/modules/builder.js');
    const canvas = document.getElementById('canvas');

    // Create three chips laid out horizontally
    const rects = [
      { left: 0, width: 50, top: 0, height: 30 },
      { left: 60, width: 50, top: 0, height: 30 },
      { left: 120, width: 50, top: 0, height: 30 }
    ];
    rects.forEach((r, i) => canvas.appendChild(mockChip(i, r)));

    // Pointer to the right of last chip center
    const idx = builder.BuilderAPI.getDropIndex(canvas, 200, 10);
    expect(idx).toBe(3);
  });

  test('returns middle index when pointing between first and second chips', async () => {
    setupDOM();
    const builder = await import('../js/modules/builder.js');
    const canvas = document.getElementById('canvas');

    const rects = [
      { left: 0, width: 50, top: 0, height: 30 },
      { left: 60, width: 50, top: 0, height: 30 }
    ];
    rects.forEach((r, i) => canvas.appendChild(mockChip(i, r)));

    // Between chip 0 and 1 (x=55 lies between right edge of 0 and left edge of 1)
    const idx = builder.BuilderAPI.getDropIndex(canvas, 55, 10);
    expect(idx).toBe(1);
  });
});
