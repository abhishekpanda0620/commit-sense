# CommitSense

CommitSense helps developers write accurate, meaningful, and semantically correct Conventional Commits by analyzing diffs and suggesting the appropriate commit type and scope.

## Features (Phase 1 MVP)

- **Fast & Local**: Runs entirely on your machine.
- **Smart Suggestions**: Analyzes staged files to suggest commit types (feat, fix, chore, etc.).
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
commitsense
```

Follow the interactive prompts to confirm or edit the commit message.

## Development

1. Clone the repo
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Run locally: `npm run dev` (or `node bin/commitsense.js`)

## Roadmap

See [docs/CommitSense_ROADMAP.md](docs/CommitSense_ROADMAP.md) for future plans.
