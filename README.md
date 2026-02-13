# CommitSense

[![npm version](https://badge.fury.io/js/commit-sense-cli.svg)](https://badge.fury.io/js/commit-sense-cli)
[![CI](https://github.com/abhishekpanda0620/commit-sense/actions/workflows/ci.yml/badge.svg)](https://github.com/abhishekpanda0620/commit-sense/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
npm install -g commit-sense-cli
```

## Usage

Stage your changes:

```bash
git add .
```

Run CommitSense instead of `git commit`:

```bash
commit-sense-cli
```

Follow the interactive prompts to confirm or edit the commit message.

## Development

1. Clone the repo
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Run locally: `npm run dev` (or `node bin/commitsense.js`)

## Optional: Enforce Commit Convention

You can use `commit-sense-cli` to validate commit messages with git hooks (e.g., using **Husky**).

1. Install Husky:
```bash
npm install --save-dev husky
npx husky init
```

2. Add a `commit-msg` hook:
```bash
echo "npx commit-sense-cli validate \$1" > .husky/commit-msg
```

Now, if you try to commit with an invalid message (e.g., `git commit -m "bad message"`), it will be rejected.

## Contributing

We love contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

## Security

If you discover a security vulnerability, please check our [Security Policy](SECURITY.md).

## License

This project is licensed under the [MIT License](LICENSE).


