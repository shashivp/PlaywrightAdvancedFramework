# Playwright Advanced Framework

A modular Playwright automation framework for advanced end-to-end testing.

## Overview

This repository provides a structured Playwright test framework built with TypeScript. It includes:

- Page object model support under `src/pages`
- Reusable fixtures and utilities under `src/fixtures` and `src/utils`
- API and configuration helpers under `src/api` and `src/config`
- External test data support under `src/testdata`
- Example tests in `tests/example.spec.ts`

## Key Dependencies

- `@playwright/test`
- `dotenv`
- `@faker-js/faker`
- `allure-playwright`
- `winston`
- `xlsx`
- `ajv` and `ajv-formats`
- `jsonpath-plus`
- `csv-parse`

## Project Structure

- `src/`
  - `api/` - API helpers and service wrappers
  - `config/` - test configuration and environment settings
  - `fixtures/` - custom fixtures for Playwright tests
  - `pages/` - page object models
  - `testdata/` - reusable test data and external input files
  - `tests/` - test implementations and suites
  - `utils/` - utility helpers and shared functions
- `tests/` - top-level test files
- `docs/` - supporting documentation and rules
- `.github/` - GitHub workflows and configuration

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run Playwright tests:

```bash
npx playwright test
```

3. To run a specific test file:

```bash
npx playwright test tests/example.spec.ts
```

## Configuration

- Use `.env` for environment-specific variables.
- Update `playwright.config.ts` as needed for browser settings, test directories, and reporter configuration.

## Notes

- The repository is configured for CommonJS (`type: commonjs`) in `package.json`.
- Add custom scripts to `package.json` as needed for CI or local workflows.
