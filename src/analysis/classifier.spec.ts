
import { classifyChanges } from './classifier';

describe('Classifier', () => {
  it('should detect "feat" for source files', () => {
    const files = ['src/components/Button.ts', 'src/utils/helpers.ts'];
    const result = classifyChanges(files);
    expect(result.type).toBe('feat');
  });

  it('should detect "chore" for config files', () => {
    const files = ['package.json', 'package-lock.json'];
    const result = classifyChanges(files);
    expect(result.type).toBe('chore');
  });

  it('should detect "test" for test files', () => {
    const files = ['src/utils/helpers.spec.ts', 'test/integration.test.ts'];
    const result = classifyChanges(files);
    expect(result.type).toBe('test');
  });

  it('should detect "docs" for documentation', () => {
    const files = ['README.md', 'docs/guide.md'];
    const result = classifyChanges(files);
    expect(result.type).toBe('docs');
  });

  it('should prioritize dominant type', () => {
      const files = ['src/foo.ts', 'src/bar.ts', 'readme.md']; // 2 feats, 1 doc
      const result = classifyChanges(files);
      expect(result.type).toBe('feat');
  });
});
