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

## Utilities

### Logger (src/utils/logger.ts)
A Winston-backed logging system with scoped loggers:

```typescript
import { createLogger } from '@utils/logger';

const log = createLogger('MyClass');
log.info('This message is tagged with [MyClass]');
log.debug('Debug information');
log.error('Error message');
```

Output format: `2026-08-18 09:11:55 [info] [MyClass] Message text`

Logs are written to both:
- Console (with color formatting)
- `logs/combined.log` file

### Element Locator (src/utils/UtilElementLocator.ts)
A flexible utility for common element interactions:

```typescript
import { UtilElementLocator } from '@utils/UtilElementLocator';

const el = new UtilElementLocator(page, 'MyTestClass');

// Mouse actions
await el.click(selector);
await el.doubleClick(selector);
await el.rightClick(selector);
await el.hover(selector);

// Input actions
await el.fill(selector, 'text');
await el.type(selector, 'text'); // Uses pressSequentially
await el.clear(selector);

// Getters
const text = await el.getText(selector);
const value = await el.getAttribute(selector, 'attr-name');
const isVisible = await el.isVisible(selector);
```

Supports both CSS selectors (strings) and Playwright Locators.

## Advanced Features

### Headed Mode Testing
Run tests with a visible browser for debugging:

```bash
npx playwright test --headed
npx playwright test src/tests/Login.spec.ts --headed
```

### Debug Mode
Enable Playwright Inspector:

```bash
npx playwright test --debug
```

### Test Reports
Playwright generates comprehensive HTML reports with:
- Test execution timeline
- Screenshots and videos
- Trace files for detailed debugging
- Network activity logs

View the last report:
```bash
npx playwright show-report
```

### Environment-Based Testing
Switch environments via `TTA_ENV`:

```bash
TTA_ENV=qa npx playwright test
TTA_ENV=dev npx playwright test
TTA_ENV=prod npx playwright test
```

Or set in `.env`:
```env
TTA_ENV=stg
```

## Best Practices

### Page Objects
- Keep selectors private within page objects
- Use descriptive method names that reflect user actions
- Always log important steps using `this.log.info()`
- Return `this` from navigation methods for chaining (optional)

### Tests
- Use `test.step()` to organize test flows
- Use meaningful test names describing the scenario
- Tag tests with `@p0`, `@p1`, etc. for priority grouping
- Keep tests focused on a single user flow
- Use data-driven testing with `test.describe()` and fixtures

### Selectors
- Prefer `data-test` attributes over CSS/XPath
- Make selectors stable and resistant to UI changes
- Avoid deep DOM traversal

### Assertions
- Use Playwright's built-in assertions with proper timeouts
- Avoid multiple assertions in test steps
- Assert on visibility or state, not just element presence

## Debugging & Troubleshooting

### Common Issues

**1. Import errors with path aliases**
```
Error: Cannot find module '@pages/LoginPage'
```
Solution: Ensure `tsconfig.json` has proper `paths` configuration and aliases.

**2. Element not found**
```
Error: locator.click: Target page, context or browser has been closed
```
Solution: Check element selectors are correct and wait for proper page load.

**3. Test timeouts**
- Increase timeout in `playwright.config.ts`: `timeout: 60000`
- Check network conditions and element visibility
- Use `.waitFor()` methods to wait for specific conditions

### Viewing Logs
```bash
# View combined logs
cat logs/combined.log

# Filter by specific test
grep "login.spec" logs/combined.log
```

## Recent Updates

### ✅ Completed (Latest Commit)
- ✅ Added TypeScript path aliases configuration for cleaner imports (@pages, @utils, @fixtures, @config, @testdata, @api)
- ✅ Updated `BasePage` class with logger (`log`) and element locator (`el`) properties
- ✅ All page objects now inherit logging and element interaction utilities
- ✅ Login test passes successfully in headed mode with detailed logging
- ✅ Comprehensive README documentation with examples and best practices
- ✅ All files pushed to GitHub repository

### Test Status
- ✅ `src/tests/Login.spec.ts` - **PASSING**
  - Test: "logs in with valid credentials @p0"
  - Duration: ~2-3 seconds
  - Artifacts: Video, trace, screenshots
  - Status: ✓ 1 passed

## Development Workflow

1. **Setup**
   ```bash
   npm install
   npx playwright install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Create Test Structure**
   - Add page object in `src/pages/YourPage.ts`
   - Add test in `src/tests/YourTest.spec.ts`
   - Add test data in `src/testdata/` if needed

4. **Run Tests**
   ```bash
   npx playwright test                          # Run all
   npx playwright test --headed                 # Show browser
   npx playwright test --debug                  # Debug mode
   npx playwright show-report                   # View reports
   ```

5. **Review & Push**
   ```bash
   git status
   git add .
   git commit -m "feat: Add new test"
   git push origin main
   ```

## Contribution Guidelines

This repository follows structured automation practices:

- **Code Quality**: Use TypeScript strict mode, consistent naming conventions
- **Readability**: Write tests that read like documentation
- **Maintainability**: Use page objects, avoid code duplication
- **Scalability**: Design utilities for reuse across multiple tests
- **Documentation**: Comment complex logic, update README for major changes

### Commit Message Format
```
<type>: <description>

feat: Add new test feature
fix: Resolve failing test
docs: Update documentation
refactor: Improve code structure
```

## Support & Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [TTACart Application](https://app.thetestingacademy.com)
- [Test Academy Learning Resources](https://thetestingacademy.com)
