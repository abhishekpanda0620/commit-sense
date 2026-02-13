# Contributing to CommitSense

Thank you for your interest in contributing to CommitSense!

## Getting Started

1.  **Fork the repository**.
2.  **Clone your fork**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/commit-sense.git
    cd commit-sense
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```

## Development

-   **Run locally**:
    ```bash
    npm run dev
    ```
-   **Run tests**:
    ```bash
    npm test
    ```

## Commit Convention

We use **Conventional Commits** (obviously!).
Please use `commit-sense-cli` to generate your commit messages:

```bash
npm run dev
# or
npx commit-sense-cli
```

## Pull Requests

1.  Create a new branch for your feature or fix.
2.  Ensure tests pass (`npm test`).
3.  Update documentation if needed.
4.  Submit a Pull Request targeting the `main` branch.
