
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export function validateCommitMessage(message: string): ValidationResult {
    const errors: string[] = [];
    const conventionalCommitRegex = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .+$/;

    const firstLine = message.split('\n')[0];

    if (!conventionalCommitRegex.test(firstLine)) {
        errors.push('Commit message must follow format: type(scope): subject');
        errors.push('Example: feat(auth): add login support');
        errors.push('Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
