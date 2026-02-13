
import { classifyChanges } from './classifier';

describe('Classifier', () => {
  it('should detect "feat" for source files', async () => {
    const files = [
        { path: 'src/components/Button.ts', diff: '' },
        { path: 'src/utils/helpers.ts', diff: '' }
    ];
    const result = await classifyChanges(files);
    expect(result.type).toBe('feat');
  });

  it('should detect "chore" for config files', async () => {
    const files = [
        { path: 'package.json', diff: '' },
        { path: 'package-lock.json', diff: '' }
    ];
    const result = await classifyChanges(files);
    expect(result.type).toBe('chore');
  });

  it('should detect "test" for test files', async () => {
    const files = [
        { path: 'src/utils/helpers.spec.ts', diff: '' },
        { path: 'test/integration.test.ts', diff: '' }
    ];
    const result = await classifyChanges(files);
    expect(result.type).toBe('test');
  });

  it('should detect "docs" for documentation', async () => {
    const files = [
        { path: 'README.md', diff: '' },
        { path: 'docs/guide.md', diff: '' }
    ];
    const result = await classifyChanges(files);
    expect(result.type).toBe('docs');
  });

  it('should prioritize dominant type', async () => {
      const files = [
          { path: 'src/foo.ts', diff: '' },
          { path: 'src/bar.ts', diff: '' },
          { path: 'readme.md', diff: '' }
      ]; // 2 feats, 1 doc
      const result = await classifyChanges(files);
      expect(result.type).toBe('feat');
  });
});
