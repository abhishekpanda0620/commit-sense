
import { DependencyAnalyzer } from './analyzer';
import { CodeAnalyzer } from './codeAnalyzer';

describe('DependencyAnalyzer', () => {
    const analyzer = new DependencyAnalyzer();

    it('should detect chore for dependency updates', async () => {
        const changes = [{
            path: 'package.json',
            diff: '  "dependencies": {\n- "react": "^17.0.0",\n+ "react": "^18.0.0"'
        }];
        const result = await analyzer.analyze(changes);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].type).toBe('chore');
        expect(result[0].confidence).toBeGreaterThan(0.8);
    });

    it('should detect chore for lockfile changes', async () => {
        const changes = [{
            path: 'package-lock.json',
            diff: 'some diff'
        }];
        const result = await analyzer.analyze(changes);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].type).toBe('chore');
    });
});

describe('CodeAnalyzer', () => {
    const analyzer = new CodeAnalyzer();

    it('should detect feat for new exports', async () => {
        const changes = [{
            path: 'src/foo.ts',
            diff: '+ export function bar() {}'
        }];
        const result = await analyzer.analyze(changes);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].type).toBe('feat');
        expect(result[0].confidence).toBeGreaterThan(0.8);
    });

    it('should detect refactor (detects removal) for removed exports', async () => {
        const changes = [{
            path: 'src/foo.ts',
            diff: '- export function old() {}'
        }];
        const result = await analyzer.analyze(changes);
        expect(result.length).toBeGreaterThan(0);
        // Current implementation defaults to refactor for removals
        expect(result[0].type).toBe('refactor'); 
    });

    it('should ignore non-exported changes', async () => {
        const changes = [{
            path: 'src/foo.ts',
            diff: '+ const internal = 1;'
        }];
        const result = await analyzer.analyze(changes);
        expect(result.length).toBe(0);
    });
});
