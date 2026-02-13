
import { CommitType } from './classifier';

export interface AnalysisResult {
    type: CommitType;
    confidence: number;
    reason: string;
}

export interface FileChange {
    path: string;
    diff: string; // The git diff output
}

export interface Analyzer {
    analyze(fileChanges: FileChange[]): Promise<AnalysisResult[]>;
}

export class DependencyAnalyzer implements Analyzer {
    async analyze(fileChanges: FileChange[]): Promise<AnalysisResult[]> {
        const results: AnalysisResult[] = [];

        for (const file of fileChanges) {
            if (file.path.endsWith('package.json')) {
                const diff = file.diff;
                // Simple regex to check for dependency changes
                // Look for lines adding/changing dependencies
                // + "react": "^18.0.0"
                
                const addedDeps = (diff.match(/^\+.*"(dependencies|devDependencies|peerDependencies)"/m));
                const changedLine = (diff.match(/^\+.*:\s*".*"/mg));

                if (addedDeps || changedLine) {
                    // Check if it is a devDependency (chore) or runtime dependency (fix/feat/chore depending on convention)
                    // For now, let's treat all dependency updates as 'chore' but with high confidence, 
                    // unless we can detect it's a critical fix? 
                    // Standard convention: 
                    // valid: chore(deps): update react
                    // So 'chore' is safe.
                    
                    results.push({
                        type: 'chore',
                        confidence: 0.9,
                        reason: `Detected dependency change in ${file.path}`
                    });
                }
            }
             if (file.path.endsWith('package-lock.json') || file.path.endsWith('yarn.lock') || file.path.endsWith('pnpm-lock.yaml')) {
                 results.push({
                    type: 'chore',
                    confidence: 0.9,
                    reason: `Detected lockfile change in ${file.path}`
                });
             }
        }
        return results;
    }
}
