
import { detectScope } from './scope';

describe('Scope Detection', () => {
  it('should detect scope from src subdirectory', () => {
    const files = ['src/auth/login.ts', 'src/auth/logout.ts'];
    const scope = detectScope(files);
    expect(scope).toBe('auth');
  });

  it('should detect scope from packages subdirectory', () => {
    const files = ['packages/core/src/index.ts'];
    const scope = detectScope(files);
    expect(scope).toBe('core');
  });

  it('should return empty string for root files', () => {
    const files = ['README.md', 'package.json'];
    const scope = detectScope(files);
    expect(scope).toBe('');
  });

  it('should pick most frequent scope', () => {
      const files = ['src/ui/button.ts', 'src/ui/input.ts', 'src/api/client.ts'];
      const scope = detectScope(files);
      expect(scope).toBe('ui');
  });
});
