
import chalk from 'chalk';
import prompts from 'prompts';
import { getStagedFiles, getStagedFileDiff } from './utils/git';
import { classifyChanges } from './analysis/classifier';
import { detectScope } from './analysis/scope';
import { spawn } from 'child_process';

async function main() {
    console.log(chalk.cyan('CommitSense - Smart Commit Wizard'));

    // 1. Get staged files
    const stagedFiles = await getStagedFiles();
    if (stagedFiles.length === 0) {
        console.log(chalk.yellow('No staged files found. Please stage your changes first.'));
        process.exit(0);
    }
    
    console.log(chalk.gray(`Found ${stagedFiles.length} staged file(s):`));
    stagedFiles.slice(0, 5).forEach(f => console.log(chalk.gray(` - ${f}`)));
    if (stagedFiles.length > 5) console.log(chalk.gray(` ... and ${stagedFiles.length - 5} more.`));

    // 2. Analyze
    const fileChanges = await Promise.all(stagedFiles.map(async file => ({
        path: file,
        diff: await getStagedFileDiff(file)
    })));

    const classification = await classifyChanges(fileChanges);
    const suggestedScope = detectScope(stagedFiles);

    // 3. Prompt
    const response = await prompts([
        {
            type: 'select',
            name: 'type',
            message: 'Select commit type:',
            choices: [
                { title: 'feat', value: 'feat', description: 'A new feature' },
                { title: 'fix', value: 'fix', description: 'A bug fix' },
                { title: 'chore', value: 'chore', description: 'Build process or auxiliary tool changes' },
                { title: 'docs', value: 'docs', description: 'Documentation only changes' },
                { title: 'style', value: 'style', description: 'Markup, white-space, formatting, missing semi-colons...' },
                { title: 'refactor', value: 'refactor', description: 'A code change that neither fixes a bug or adds a feature' },
                { title: 'perf', value: 'perf', description: 'A code change that improves performance' },
                { title: 'test', value: 'test', description: 'Adding missing tests' },
                { title: 'ci', value: 'ci', description: 'CI related changes' },
            ],
            initial: ['feat','fix','chore','docs','style','refactor','perf','test','ci'].indexOf(classification.type)
        },
        {
            type: 'text',
            name: 'scope',
            message: 'Scope (optional):',
            initial: suggestedScope
        },
        {
            type: 'text',
            name: 'description',
            message: 'Short description:',
            validate: (value: string) => value.length > 0 ? true : 'Description is required'
        },
        {
            type: 'text',
            name: 'body',
            message: 'Long description (optional):',
        },
        {
            type: 'text',
            name: 'footer',
            message: 'Footer (optional, e.g. BREAKING CHANGE):',
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: (prev: any, values: any) => {
                const scopePart = values.scope ? `(${values.scope})` : '';
                const title = `${values.type}${scopePart}: ${values.description}`;
                console.log(chalk.green('\nPreview:'));
                console.log(chalk.bold(title));
                if (values.body) console.log(`\n${values.body}`);
                if (values.footer) console.log(`\n${values.footer}`);
                return 'Commit now?';
            },
            initial: true
        }
    ]);

    if (!response.confirm) {
        console.log(chalk.yellow('Commit cancelled.'));
        process.exit(0);
    }

    // 4. Construct Commit Message
    const scopePart = response.scope ? `(${response.scope})` : '';
    let commitMsg = `${response.type}${scopePart}: ${response.description}`;
    
    if (response.body) {
        commitMsg += `\n\n${response.body}`;
    }
    if (response.footer) {
        commitMsg += `\n\n${response.footer}`;
    }

    // 5. Execute Commit
    const child = spawn('git', ['commit', '-m', commitMsg], { stdio: 'inherit' });
    
    child.on('close', (code) => {
        if (code === 0) {
            console.log(chalk.green('Commit successful!'));
        } else {
            console.log(chalk.red(`Commit failed with code ${code}`));
        }
    });
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
