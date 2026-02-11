
export type CommitType = 'feat' | 'fix' | 'chore' | 'docs' | 'style' | 'refactor' | 'test' | 'ci';

export interface CommitClassification {
  type: CommitType;
  confidence: number;
  reason: string;
}

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

export function classifyChanges(stagedFiles: string[]): CommitClassification {
    const typeCounts: Record<string, number> = {};

    for (const file of stagedFiles) {
        const basename = file.split('/').pop() || '';
        const ext = '.' + file.split('.').pop();
        
        let type: CommitType = 'feat'; // Default assumption

        if (file.includes('test/') || file.includes('tests/')) {
            type = 'test';
        } else if (file.startsWith('.github/') || file.includes('/.github/')) {
             type = 'ci';
        } else if (file.startsWith('docs/')) {
            type = 'docs';
        } else if (FILENAME_MAPPING[basename]) {
            type = FILENAME_MAPPING[basename];
        } else {
            // Check extensions, prioritize longer matches (e.g. .spec.ts over .ts if we had .ts)
            for (const extKey in EXTENSION_MAPPING) {
                if (file.endsWith(extKey)) {
                    type = EXTENSION_MAPPING[extKey];
                    break;
                }
            }
        }
        
        typeCounts[type] = (typeCounts[type] || 0) + 1;
    }

    // Find majority
    let maxType: CommitType = 'feat';
    let maxCount = 0;
    
    for (const [t, count] of Object.entries(typeCounts)) {
        if (count > maxCount) {
            maxCount = count;
            maxType = t as CommitType;
        }
    }
    
    // Simple confidence logic
    const total = stagedFiles.length;
    const confidence = total > 0 ? maxCount / total : 0;

    return {
        type: maxType,
        confidence,
        reason: `Detected ${maxType} based on ${maxCount}/${total} files.`
    };
}
