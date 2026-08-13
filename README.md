# Playwright Advanced Framework

A modular Playwright automation framework for advanced end-to-end and API-inspired UI testing using TypeScript.

## Overview

This project is set up to help automate browser-based test flows with a clean project structure, reusable page objects, utility helpers, and environment-aware configuration.

It includes:

- Page object model structure under `src/pages`
- Shared custom fixtures under `src/fixtures`
- API helper modules under `src/api`
- Environment/config utilities under `src/config`
- Reusable test data under `src/testdata`
- Utility functions under `src/utils`
- Test suites under `src/tests`
- Browser automation setup in `playwright.config.ts`

## Tech Stack

The project uses the following main dependencies:

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

```text
PlaywrightAdvancedFramework/
├── src/
│   ├── api/
│   ├── config/
│   ├── fixtures/
│   ├── pages/
│   ├── testdata/
│   ├── tests/
│   └── utils/
├── tests/
├── docs/
├── rules/
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── .env.example
├── README.md
└── .gitignore
```

## Prerequisites

Before running tests, make sure you have:

- Node.js installed
- npm installed
- Playwright browsers installed

Install dependencies:

```bash
npm install
```

Install the browser binaries used by Playwright:

```bash
npx playwright install
```

## Configuration

This project loads environment variables using `dotenv` from a `.env` file.

Create a `.env` file in the project root with values like:

```env
TTA_ENV=qa
BASE_URL=https://app.thetestingacademy.com
QA_BASE_URL=https://app.thetestingacademy.com
DEV_BASE_URL=http://localhost:3000
STG_BASE_URL=https://stage.thetestingacademy.com
PROD_BASE_URL=https://app.thetestingacademy.com
API_BASE_URL=https://restful-booker.herokuapp.com
```

The config in `playwright.config.ts` automatically resolves the correct base URL based on `TTA_ENV` or `BASE_URL`.

## Running Tests

Run all tests:

```bash
npx playwright test
```

Run only the Chromium project:

```bash
npx playwright test --project=chromium
```

Run a specific file:

```bash
npx playwright test src/tests/example.spec.ts
```

Run in headed mode for debugging:

```bash
npx playwright test --headed
```

Generate and open the HTML report:

```bash
npx playwright show-report
```

## Playwright Config Highlights

The project configuration includes:

- `testDir: './src/tests'` for test discovery
- `baseURL` resolved from environment values
- global timeout settings
- parallel test execution
- screenshot capture on failure
- video recording enabled
- HTML and list reporting
- Chromium desktop browser setup

## Notes

- `TTA_ENV` can be set to values such as `qa`, `dev`, `stg`, `prod`, or `local`.
- If `BASE_URL` is set, it takes priority over the environment-based URL selection.
- The framework is designed to be easy to extend with new page objects, fixtures, and utilities.

## Example Workflow

1. Set environment variables in `.env`
2. Write a new test under `src/tests`
3. Add page objects under `src/pages`
4. Run the suite with Playwright
5. Review HTML reports for failures and traces

## Contribution

This repository is intended for structured, maintainable automation work. Keep tests readable, data-driven where possible, and use reusable page objects for better scalability.
