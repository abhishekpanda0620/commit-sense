
import path from 'path';

/**
 * Detects the scope of the commit based on the staged files.
 * @param stagedFiles List of staged files
 * @returns The detected scope, or an empty string if no clear scope found.
 */
export function detectScope(stagedFiles: string[]): string {
    if (stagedFiles.length === 0) return '';

    const scopes: Record<string, number> = {};

    for (const file of stagedFiles) {
        const dirname = path.dirname(file);
        if (dirname === '.') continue; // Root files don't suggest specific scope usually

        const parts = dirname.split(path.sep);
        // Use the first directory as the scope (e.g., 'src' in 'src/utils/foo.ts')
        // Or maybe the last significant folder? 
        // Let's try to be smart: if it's 'src/components/Button', scope is 'components' or 'Button'?
        // Convention varies. Let's try the *first* folder for now (e.g. 'auth' in 'packages/auth')
        // or the *last* folder if it's nested deep?
        
        // Strategy: 
        // 1. If 'packages/*', use the package name.
        // 2. If 'src/*', use the immediate subdirectory.
        
        let candidate = '';
        if (parts[0] === 'packages' && parts.length > 1) {
            candidate = parts[1];
        } else if (parts[0] === 'src' && parts.length > 1) {
             candidate = parts[1];
        } else {
             candidate = parts[0];
        }

        if (candidate) {
            scopes[candidate] = (scopes[candidate] || 0) + 1;
        }
    }

    // Filter out blacklisted scopes if there are other candidates
    const BLACKLIST = ['utils', 'helpers', 'common', 'shared', 'types', 'interfaces'];
    
    // Calculate counts
    let maxScope = '';
    let maxCount = 0;
    
    // First pass: try to find non-blacklisted scopes
    const nonBlacklistedScopes = Object.entries(scopes).filter(([s]) => !BLACKLIST.includes(s));
    
    const candidates = nonBlacklistedScopes.length > 0 ? nonBlacklistedScopes : Object.entries(scopes);

    for (const [scope, count] of candidates) {
        if (count > maxCount) {
             maxCount = count;
             maxScope = scope;
        }
    }

    return maxScope;
}
