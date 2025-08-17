// Jest setup file for RegCraft
// Ensure Jest globals are available in ESM tests.

try {
  // @jest/globals provides named exports for ESM; expose to global for convenience
  const { jest: jestGlobals } = require('@jest/globals');
  if (jestGlobals && !globalThis.jest) {
    globalThis.jest = jestGlobals;
  }
} catch (e) {
  // If not available, ignore; tests that rely on jest global may fail, but in CI it should be present.
}

// Add any per-test initialization here if needed.
// Example: increase default timeout if flaky async tests appear
// jest.setTimeout(10000);
