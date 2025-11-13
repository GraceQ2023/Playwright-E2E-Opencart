import { Page } from '@playwright/test';

export class BasePage {

  protected page: Page;  // 'protected': accessible to all other page classes that extend it

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for the page to reach a stable state before interacting with it 
   * @param titleKeyword  - keyword that should appear in the page title
   * @param timeout - default: 15s
   */

  async waitForStablePage(titleKeyword: string, timeout = 15000): Promise<boolean> {

    try {
      await this.page.waitForLoadState('networkidle', { timeout });
    } 
    catch {
      console.log(`⚠️ Page load wait timed out for page: "${titleKeyword}"`)
    }

    const title = (await this.page.title()).toLowerCase();
    return title.includes(titleKeyword.toLowerCase());
  }
}
