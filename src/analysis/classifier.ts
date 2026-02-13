
import { Analyzer, FileChange } from './analyzer';
import { DependencyAnalyzer } from './analyzer';
import { CodeAnalyzer } from './codeAnalyzer';
import { SimpleAnalyzer } from './simpleAnalyzer';

export type CommitType = 'feat' | 'fix' | 'chore' | 'docs' | 'style' | 'refactor' | 'test' | 'ci';

export interface CommitClassification {
  type: CommitType;
  confidence: number;
  reason: string;
}

export async function classifyChanges(fileChanges: FileChange[]): Promise<CommitClassification> {
    const analyzers: Analyzer[] = [
        new DependencyAnalyzer(),
        new CodeAnalyzer(),
        new SimpleAnalyzer()
    ];

    let bestResult: CommitClassification = {
        type: 'feat',
        confidence: 0,
        reason: 'Default'
    };

    for (const analyzer of analyzers) {
        const results = await analyzer.analyze(fileChanges);
        for (const result of results) {
            if (result.confidence > bestResult.confidence) {
                bestResult = result;
            }
        }
    }

    return bestResult;
}

