
import { Analyzer, AnalysisResult, FileChange } from './analyzer';
import { CommitType } from './classifier';

const EXTENSION_MAPPING: Record<string, CommitType> = {
    '.md': 'docs',
    '.txt': 'docs',
    '.spec.ts': 'test',
    '.test.ts': 'test',
    '.spec.js': 'test',
    '.test.js': 'test',
    '.json': 'chore',
    '.yaml': 'chore',
    '.yml': 'chore',
    '.css': 'style',
    '.scss': 'style',
    '.less': 'style',
};

const FILENAME_MAPPING: Record<string, CommitType> = {
    'package.json': 'chore',
    'package-lock.json': 'chore',
    'tsconfig.json': 'chore',
    '.gitignore': 'chore',
    '.eslintrc': 'chore',
    '.prettierrc': 'chore',
    'README.md': 'docs',
    'LICENSE': 'chore',
    'Dockerfile': 'ci',
    '.github': 'ci',
};

export class SimpleAnalyzer implements Analyzer {
    async analyze(fileChanges: FileChange[]): Promise<AnalysisResult[]> {
        const typeCounts: Record<string, number> = {};
        const total = fileChanges.length;

        for (const file of fileChanges) {
            const path = file.path;
            const basename = path.split('/').pop() || '';
            const ext = '.' + path.split('.').pop();
            
            let type: CommitType = 'feat'; // Default assumption

            if (path.includes('test/') || path.includes('tests/')) {
                type = 'test';
            } else if (path.startsWith('.github/') || path.includes('/.github/')) {
                 type = 'ci';
            } else if (path.startsWith('docs/')) {
                type = 'docs';
            } else if (FILENAME_MAPPING[basename]) {
                type = FILENAME_MAPPING[basename];
            } else {
                for (const extKey in EXTENSION_MAPPING) {
                    if (path.endsWith(extKey)) {
                        type = EXTENSION_MAPPING[extKey];
                        break;
                    }
                }
            }
            
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        }

        // Return the majority vote as a single result with confidence
        let maxType: CommitType = 'feat';
        let maxCount = 0;
        
        for (const [t, count] of Object.entries(typeCounts)) {
            if (count > maxCount) {
                maxCount = count;
                maxType = t as CommitType;
            }
        }
        
        const confidence = total > 0 ? (maxCount / total) * 0.5 : 0; // Lower confidence for simple extension matching (max 0.5)

        return [{
            type: maxType,
            confidence,
            reason: `Detected ${maxType} based on file extensions (${maxCount}/${total} files).`
        }];
    }
}
