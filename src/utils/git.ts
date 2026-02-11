import simpleGit from 'simple-git';
import path from 'path';

const git = simpleGit();

/**
 * Get a list of currently staged files.
 * @returns Array of file paths (relative to repo root)
 */
export async function getStagedFiles(): Promise<string[]> {
  try {
    const diff = await git.diff(['--cached', '--name-only', '--diff-filter=ACMR']);
    return diff.split('\n').filter(Boolean).map(f => f.trim());
  } catch (error) {
    console.error('Error getting staged files:', error);
    process.exit(1);
  }
}

/**
 * Get the diff of a specific staged file.
 * @param filePath Relative path to the file
 */
export async function getStagedFileDiff(filePath: string): Promise<string> {
    try {
        return await git.diff(['--cached', filePath]);
    } catch (error) {
        console.error(`Error getting diff for ${filePath}:`, error);
        return '';
    }
}
