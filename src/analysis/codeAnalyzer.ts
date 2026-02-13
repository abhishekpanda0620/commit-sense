
import { Analyzer, AnalysisResult, FileChange } from './analyzer';

export class CodeAnalyzer implements Analyzer {
    async analyze(fileChanges: FileChange[]): Promise<AnalysisResult[]> {
        const results: AnalysisResult[] = [];

        for (const file of fileChanges) {
            // Only analyze source code files
            if (!file.path.match(/\.(ts|js|jsx|tsx)$/)) continue;
            if (file.path.endsWith('.d.ts')) continue; // Skip type definitions for now? Or maybe they are important for API?

            const diff = file.diff;
            
            // Regex for detecting exported members
            // This is a naive heuristic but works for MVP
            const removedExportRegex = /^-.*export\s+(const|let|var|function|class|interface|type|enum)\s+([a-zA-Z0-9_$]+)/m;
            const addedExportRegex = /^\+.*export\s+(const|let|var|function|class|interface|type|enum)\s+([a-zA-Z0-9_$]+)/m;

            // Check for BREAKING CHANGES (removed exports)
            // We need to be careful: if a line is modified, it appears as - then +, so we need to see if the same name is added back.
            
            const removedExports = new Set<string>();
            const addedExports = new Set<string>();

            const lines = diff.split('\n');
            for (const line of lines) {
                const removedMatch = line.match(removedExportRegex);
                if (removedMatch) {
                   removedExports.add(removedMatch[2]);
                }
                const addedMatch = line.match(addedExportRegex);
                if (addedMatch) {
                    addedExports.add(addedMatch[2]);
                }
            }

            // identify truly removed exports (not just modified lines)
            for (const removed of removedExports) {
                if (!addedExports.has(removed)) {
                    results.push({
                        type: 'refactor', // defaulting to refactor or feat? logic says removing api is breaking, usually requires 'feat!' or just footer. for type, maybe 'refactor' or 'chore'?
                        // Actually, breaking changes can be any type, but usually feat or fix.
                        // For the purpose of *type* classification:
                        // Removing API -> refactor (if cleanup) or feat (if breaking change logic)
                        // Let's stick to 'refactor' for now, but with proper breaking change detection we might want to flag it in footer.
                        confidence: 0.8,
                        reason: `Detected removal of exported symbol '${removed}' in ${file.path}`
                    });
                }
            }

            // Identify NEW exports
            for (const added of addedExports) {
                if (!removedExports.has(added)) {
                    results.push({
                        type: 'feat',
                        confidence: 0.9,
                        reason: `Detected new exported symbol '${added}' in ${file.path}`
                    });
                }
            }
        }
        
        return results;
    }
}
