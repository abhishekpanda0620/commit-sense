# CommitSense

CommitSense helps developers write accurate, meaningful, and semantically correct Conventional Commits by analyzing diffs and suggesting the appropriate commit type and scope.

## Features 

- **Fast & Local**: Runs entirely on your machine.
- **Smart Suggestions**: Analyzes staged files to suggest commit types (feat, fix, chore, etc.).
- **Advanced Analysis** :
    - **Dependency Checks**: Detects `chore` for `package.json` updates.
    - **Code Aware**: Detects `feat` for new exports and `refactor` for removed exports.
    - **Scope Detection**: Intelligent scope suggestion based on directory structure (prioritizing feature folders over utility folders).
- **Zero Config**: Works out of the box for most projects.

## Installation

```bash
npm install -g commit-sense
```

## Usage

Stage your changes:

```bash
git add .
```

Run CommitSense instead of `git commit`:

```bash
commit-sense
```

Follow the interactive prompts to confirm or edit the commit message.

## Development

1. Clone the repo
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Run locally: `npm run dev` (or `node bin/commitsense.js`)

