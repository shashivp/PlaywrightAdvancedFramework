import { Page } from '@playwright/test';
import { createLogger, type Logger } from '@utils/logger';
import { UtilElementLocator } from '@utils/UtilElementLocator';

export abstract class BasePage {
    protected readonly page: Page;
    protected readonly log: Logger;
    protected readonly el: UtilElementLocator;

    protected constructor(page: Page, scope: string) {
        this.page = page;
        this.log = createLogger(scope);
        this.el = new UtilElementLocator(page, scope);
    }

    protected async goto(relativePath: string): Promise<void> {
        await this.page.goto(relativePath);
        await this.page.waitForLoadState('domcontentloaded');
    }
}