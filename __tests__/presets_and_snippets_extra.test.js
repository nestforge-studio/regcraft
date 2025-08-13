// Additional coverage for presets.applyPreset and snippets languages

describe('presets.applyPreset safety', () => {
  test('applyPreset ignores unknown key without throwing', async () => {
    const { applyPreset } = await import('../js/modules/presets.js');
    const setter = jest.fn();
    expect(() => applyPreset('unknown_key_xyz', setter)).not.toThrow();
    expect(setter).not.toHaveBeenCalled();
  });
});

describe('snippets: remaining languages and defaults', () => {
  test('Java snippet uses Pattern and Matcher', async () => {
    const { buildLanguageSnippet } = await import('../js/modules/snippets.js');
    const code = buildLanguageSnippet('a"b\\c', { i:true, m:false, g:false }, 'java');
    expect(code).toContain('Pattern.compile');
    expect(code).toContain('Matcher m = p.matcher(text)');
    expect(code).toContain('a\"b\\\\c');
  });

  test('C# snippet with options and non-global', async () => {
    const { buildLanguageSnippet } = await import('../js/modules/snippets.js');
    const code = buildLanguageSnippet('foo', { i:true, m:true, g:false }, 'csharp');
    expect(code).toContain('RegexOptions.IgnoreCase');
    expect(code).toContain('RegexOptions.Multiline');
    expect(code).toContain('regex.Match');
  });

  test('Default case returns prompt text when no lang matches', async () => {
    const { buildLanguageSnippet } = await import('../js/modules/snippets.js');
    const code = buildLanguageSnippet('', { i:false, m:false, g:false }, 'unknown');
    expect(code).toMatch(/Build a regex/);
    const code2 = buildLanguageSnippet('rx', { i:false, m:false, g:false }, 'unknown');
    expect(code2).toMatch(/Select a language/);
  });
});
