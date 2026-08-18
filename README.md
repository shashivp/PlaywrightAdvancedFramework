# Playwright Advanced Framework

A modular Playwright automation framework for advanced end-to-end and API-inspired UI testing using TypeScript.

## Overview

This project is set up to automate browser-based flows with a clean structure, reusable page objects, utility helpers, and environment-aware configuration.

It includes:

- Page object model support under `src/pages`
- Shared custom fixtures under `src/fixtures`
- API helper modules under `src/api`
- Environment and configuration helpers under `src/config`
- Reusable test data under `src/testdata`
- Utility functions under `src/utils`
- Test suites under `src/tests`
- Playwright setup in `playwright.config.ts`

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

### Environment Variables

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
LOG_LEVEL=info
```

The config in `playwright.config.ts` automatically resolves the correct base URL based on `TTA_ENV` or `BASE_URL`.

If you want to keep environment variables locally and avoid committing them, add `.env` to `.gitignore`.

### Path Aliases

TypeScript path aliases are configured in `tsconfig.json` for cleaner imports:

```json
{
  "paths": {
    "@pages/*": ["src/pages/*"],
    "@utils/*": ["src/utils/*"],
    "@fixtures/*": ["src/fixtures/*"],
    "@config/*": ["src/config/*"],
    "@testdata/*": ["src/testdata/*"],
    "@api/*": ["src/api/*"]
  }
}
```

This allows imports like:
```typescript
import { LoginPage } from '@pages/LoginPage';
import { createLogger } from '@utils/logger';
```

### Page Object Model Structure

All page objects extend `BasePage`, which provides:
- **`log`**: A scoped Winston logger for debugging and reporting
- **`el`**: A `UtilElementLocator` instance for element interactions (click, fill, type, getText, etc.)
- **`page`**: The Playwright Page object
- **`goto(relativePath)`**: Helper to navigate and wait for page load

Example page object:

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    private readonly usernameInput = this.page.locator('[data-test="username"]');
    private readonly passwordInput = this.page.locator('[data-test="password"]');
    private readonly loginButton = this.page.locator('[data-test="login-button"]');

    constructor(page: Page) {
        super(page, 'LoginPage');
    }

    async open(): Promise<void> {
        this.log.info('Opening login page');
        await this.goto('/path/to/login');
    }

    async loginAs(username: string, password: string): Promise<void> {
        this.log.info(`Logging in as ${username}`);
        await this.el.fill(this.usernameInput, username);
        await this.el.fill(this.passwordInput, password);
        await this.el.click(this.loginButton);
    }
}
```

## Running Tests

### Basic Commands

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
npx playwright test src/tests/Login.spec.ts
```

Run in headed mode for debugging (shows browser window):

```bash
npx playwright test --headed
```

Run in headed mode for a specific test:

```bash
npx playwright test src/tests/Login.spec.ts --headed
```

Generate and open the HTML report:

```bash
npx playwright show-report
```

### Test Example

The `src/tests/Login.spec.ts` test demonstrates the framework in action:

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { createLogger } from '@utils/logger';

const log = createLogger('login.spec');

test.describe('TTACart - Login', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await test.step('Open the TTACart login page', async () => {
            log.info('Opening the TTACart login page');
            await loginPage.open();
        });
    });

    test('logs in with valid credentials @p0', async ({ page }) => {
        await test.step('Login as standard_user', async () => {
            log.info('Logging in as standard_user');
            await loginPage.loginAs('standard_user', 'tta_secret');
        });

        await test.step('Verify login form is no longer shown', async () => {
            log.info('Asserting login form is hidden after login');
            await expect(page.locator('[data-test="login-button"]')).toBeHidden();
        });
    });
});
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
- The framework is designed to be extended easily with new page objects, fixtures, and utilities.
- The default project is Chromium desktop browser configuration, but more projects can be added as needed.

## Recent Updates

### Fixed Issues
- ✅ Added TypeScript path aliases configuration for cleaner imports
- ✅ Updated `BasePage` class to include logger (`log`) and element locator (`el`) properties
- ✅ All page objects now inherit logging and element interaction utilities
- ✅ Login test now passes successfully in headed mode

### Test Status
- ✅ `src/tests/Login.spec.ts` - PASSING
  - Logs in with valid credentials @p0
  - Duration: ~2-3 seconds
  - Includes video, trace, and screenshot artifacts

## Example Workflow

1. Set environment variables in `.env`
2. Write a new test under `src/tests`
3. Add page objects under `src/pages`
4. Run the suite with Playwright
5. Review HTML reports for failures and traces

## Contribution

This repository is intended for structured, maintainable automation work. Keep tests readable, data-driven where possible, and use reusable page objects for better scalability.
