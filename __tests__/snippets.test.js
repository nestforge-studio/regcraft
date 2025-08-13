// Tests for language snippet builder

describe('Language snippets', () => {
  test('JavaScript snippet with /gim flags', async () => {
    const { buildLanguageSnippet } = await import('../js/modules/snippets.js');
    const code = buildLanguageSnippet('foo', { i:true, m:true, g:true }, 'js');
    expect(code).toContain('const re = /foo/gim');
    expect(code).toContain('text.matchAll(re)');
  });

  test('Python snippet with IGNORECASE and MULTILINE and findall', async () => {
    const { buildLanguageSnippet } = await import('../js/modules/snippets.js');
    const code = buildLanguageSnippet('bar', { i:true, m:true, g:true }, 'python');
    expect(code).toContain('import re');
    expect(code).toContain('pattern = r"bar"');
    expect(code).toContain('re.findall');
    expect(code).toContain('re.IGNORECASE');
    expect(code).toContain('re.MULTILINE');
  });

  test('PHP snippet uses preg_match_all when g flag true', async () => {
    const { buildLanguageSnippet } = await import('../js/modules/snippets.js');
    const code = buildLanguageSnippet('baz', { i:false, m:true, g:true }, 'php');
    expect(code).toContain("$pattern = '/baz/m';");
    expect(code).toContain('preg_match_all');
  });
});
