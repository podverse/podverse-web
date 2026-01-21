import { chromium, Browser, Page, BrowserContext } from 'playwright';
import { TestUser } from './user-manager.js';

export interface TestUrls {
  homepage: string;
  channelUrl: string;
  itemUrl: string;
}

export const TEST_FIXTURES = {
  CHANNEL_1: {
    id: 'lhtest-chan-1',
    url: '/podcast/lhtest-chan-1',
    itemId: 'lhtest-item-1',
    itemUrl: '/episode/lhtest-item-1'
  }
};

export class BrowserAutomation {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private baseUrl: string;
  private cdpPort: number | null = null;
  private readonly contextOptions = {
    viewport: { width: 1366, height: 768 },
    deviceScaleFactor: 1,
    serviceWorkers: 'block' as const
  };

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }


  async initialize(): Promise<void> {
    // Use a fixed viewport/device scale for determinism and expose CDP port for Lighthouse
    this.cdpPort = 9222;
    this.browser = await chromium.launch({
      headless: true,
      args: [
        `--remote-debugging-port=${this.cdpPort}`,
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });
    this.context = await this.browser.newContext(this.contextOptions);
    this.page = await this.context.newPage();
  }

  async cleanup(): Promise<void> {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    this.cdpPort = null;
  }

  async clearCookies(): Promise<void> {
    if (!this.context) {
      throw new Error('Browser context not initialized');
    }
    await this.context.clearCookies();
  }

  async navigateToHomepage(): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }
    await this.page.goto(`${this.baseUrl}/`, { waitUntil: 'networkidle' });
    // Dismiss Alpha Warning modal if it appears on page load
    await this.dismissAlphaWarningModal();
  }

  async navigateToChannel(channelId: string, isMusic: boolean = false): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }
    const route = isMusic ? '/album' : '/podcast';
    await this.page.goto(`${this.baseUrl}${route}/${channelId}`, { waitUntil: 'networkidle' });
    // Dismiss Alpha Warning modal if it appears on page load
    await this.dismissAlphaWarningModal();
  }

  async navigateToItem(itemId: string, isMusic: boolean = false): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }
    const route = isMusic ? '/track' : '/episode';
    await this.page.goto(`${this.baseUrl}${route}/${itemId}`, { waitUntil: 'networkidle' });
    // Dismiss Alpha Warning modal if it appears on page load
    await this.dismissAlphaWarningModal();
  }

  async login(testUser: TestUser): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    // Wait for and click nav dropdown button using stable aria selector
    const dropdownButton = this.page.locator('button[aria-haspopup="menu"]').first();
    await dropdownButton.waitFor({ state: 'visible', timeout: 30000 });
    await dropdownButton.waitFor({ state: 'attached', timeout: 30000 });
    await dropdownButton.click({ timeout: 30000 });

    // Wait for dropdown menu to appear and be visible
    const dropdownMenu = this.page.locator('ul[role="menu"]').first();
    await dropdownMenu.waitFor({ state: 'visible', timeout: 10000 });

    // Click login menu item - for logged-out users this is the last menu item
    const menuItems = dropdownMenu.locator('li[role="menuitem"]');
    const menuItemCount = await menuItems.count();
    if (menuItemCount === 0) {
      throw new Error('No menu items found in nav dropdown');
    }
    const loginButton = menuItems.nth(menuItemCount - 1);
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton.click({ timeout: 10000 });

    // Wait for login modal to appear
    await this.page.waitForSelector('input[name="email"]', { timeout: 10000 });

    // Fill email
    await this.page.fill('input[name="email"]', testUser.email);

    // Fill password
    await this.page.fill('input[name="password"]', testUser.password);

    // Submit form
    const submitButton = this.page.locator('button[type="submit"]');
    await submitButton.click({ timeout: 10000 });

    // Wait for page reload after login
    await this.page.waitForLoadState('networkidle');
  }

  async dismissAlphaWarningModal(): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    // Check if environment warning modal is present
    try {
      // Wait for modal dialog to appear first
      const modal = this.page.locator('[role="dialog"]').first();
      
      // Check if modal exists in DOM
      const modalCount = await modal.count();
      if (modalCount === 0) {
        return;
      }
      
      // Wait for modal to be attached and visible
      try {
        await modal.waitFor({ state: 'attached', timeout: 10000 });
        await modal.waitFor({ state: 'visible', timeout: 15000 });
      } catch (error: any) {
        return;
      }
      
      // Look for checkbox within the modal
      const checkbox = modal.locator('input[type="checkbox"][name="disclaimer-checkbox"][value="agree"]').first();
      const checkboxCount = await checkbox.count();
      
      if (checkboxCount === 0) {
        // Try searching in entire page as fallback
        const checkboxPage = this.page.locator('input[type="checkbox"][name="disclaimer-checkbox"][value="agree"]').first();
        const checkboxPageCount = await checkboxPage.count();
        if (checkboxPageCount === 0) {
          return;
        }
      }
      
      // Wait for checkbox to be attached and visible
      try {
        await checkbox.waitFor({ state: 'attached', timeout: 10000 });
        await checkbox.waitFor({ state: 'visible', timeout: 15000 });
      } catch (error: any) {
        return;
      }
      
      // Double-check visibility
      const finalCheckboxVisible = await checkbox.isVisible({ timeout: 1000 }).catch(() => false);
      if (!finalCheckboxVisible) {
        return;
      }
      
      // Wait for checkbox to be visible and attached
      await checkbox.waitFor({ state: 'visible', timeout: 10000 });
      await checkbox.waitFor({ state: 'attached', timeout: 10000 });
        
      // Find the Continue button within the modal
      let continueButton = modal.locator('button').first();
      let buttonCount = await continueButton.count();
      
      if (buttonCount === 0) {
        // Try finding button by text content
        continueButton = this.page.locator('button:has-text("Continue"), button:has-text("OK"), button:has-text("Continuar"), button:has-text("Continuer")').first();
        buttonCount = await continueButton.count();
      }
      
      if (buttonCount === 0) {
        return;
      }
      
      // Wait for button to be attached and visible
      try {
        await continueButton.waitFor({ state: 'attached', timeout: 10000 });
        await continueButton.waitFor({ state: 'visible', timeout: 10000 });
      } catch (error: any) {
        return;
      }
        
      // Check current state of button
      let isButtonDisabled = true;
      
      try {
        isButtonDisabled = await continueButton.isDisabled();
      } catch (error: any) {
        return;
      }
        
      // If button is disabled, click checkbox to enable it
      // IMPORTANT: Use .click() instead of .check() to trigger React's onChange handler
      if (isButtonDisabled) {
        // Try clicking the label first (better for accessibility and more reliable)
        const label = modal.locator('label:has(input[name="disclaimer-checkbox"][value="agree"])').first();
        let labelCount = await label.count();
        
        if (labelCount === 0) {
          // Try page-level search
          const labelPage = this.page.locator('label:has(input[name="disclaimer-checkbox"][value="agree"])').first();
          labelCount = await labelPage.count();
          
          if (labelCount > 0) {
            try {
              await labelPage.waitFor({ state: 'visible', timeout: 5000 });
              await labelPage.click({ timeout: 10000 });
            } catch (error: any) {
              // Fallback to checkbox
              await checkbox.click({ timeout: 10000 });
            }
          } else {
            await checkbox.click({ timeout: 10000 });
          }
        } else {
          try {
            await label.waitFor({ state: 'visible', timeout: 5000 });
            await label.click({ timeout: 10000 });
          } catch (error: any) {
            // Fallback to checkbox
            await checkbox.click({ timeout: 10000 });
          }
        }
          
        // Wait a moment for React to process the click
        await this.page.waitForTimeout(500);
        
        // Wait for React to update the button's disabled state
        // Poll until button is enabled (React needs to re-render after state change)
        let buttonBecameEnabled = false;
        for (let attempt = 0; attempt < 30; attempt++) {
          try {
            await continueButton.waitFor({ state: 'visible', timeout: 500 });
            const buttonDisabled = await continueButton.isDisabled({ timeout: 500 });
            
            if (!buttonDisabled) {
              buttonBecameEnabled = true;
              break;
            }
          } catch (error: any) {
            // Continue polling
          }
          
          // Every few attempts, re-click the checkbox if needed
          if (attempt > 0 && attempt % 5 === 0) {
            const stillChecked = await checkbox.isChecked().catch(() => false);
            if (!stillChecked) {
              // Try clicking label again
              const labelRetry = modal.locator('label:has(input[name="disclaimer-checkbox"][value="agree"])').first();
              const labelRetryCount = await labelRetry.count();
              if (labelRetryCount > 0) {
                await labelRetry.click({ timeout: 2000 }).catch(() => {
                  return checkbox.click({ timeout: 2000 });
                });
              } else {
                await checkbox.click({ timeout: 2000 });
              }
              await this.page.waitForTimeout(500);
            }
          }
          
          await this.page.waitForTimeout(300);
        }
        
        if (!buttonBecameEnabled) {
          // Final state check
          const finalButtonDisabled = await continueButton.isDisabled().catch(() => true);
          if (finalButtonDisabled) {
            return;
          }
        }
      }
      
      // Click the Continue button
      try {
        await continueButton.click({ timeout: 10000 });
      } catch (error: any) {
        return;
      }
      
      // Wait for modal to close
      await checkbox.waitFor({ state: 'hidden', timeout: 10000 }).catch(async (error: any) => {
        // If checkbox still exists, try alternative: wait for modal dialog to disappear
        if (this.page) {
          const modalCheck = this.page.locator('[role="dialog"]').first();
          const modalStillVisible = await modalCheck.isVisible({ timeout: 2000 }).catch(() => false);
          if (modalStillVisible) {
            await modalCheck.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {
              // Modal didn't close, but continue anyway
            });
          }
        }
      });
      
      // Brief wait for modal dismissal to complete
      await this.page.waitForTimeout(500);
    } catch (error: any) {
      // Modal not present or already dismissed, continue without error
      // This is expected if the modal doesn't appear on certain environments
    }
  }

  async clickPlayButton(): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    // Dismiss Alpha Warning modal if present
    await this.dismissAlphaWarningModal();

    // Find play button by aria-label
    const playButton = this.page.locator('button[aria-label*="play" i]').first();
    await playButton.click({ timeout: 30000 });

    // Brief wait for e2e processes to complete
    // Media file loading is variable, but we want to measure page rendering performance
    await this.page.waitForTimeout(500);
  }

  async waitBetweenActions(): Promise<void> {
    // Brief pause between actions to allow e2e processes to complete
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  async reloadPage(): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }
    await this.page.reload({ waitUntil: 'networkidle' });
    // Dismiss Alpha Warning modal if it appears on page reload
    await this.dismissAlphaWarningModal();
  }

  async getCurrentUrl(): Promise<string> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }
    return this.page.url();
  }

  getPage(): Page {
    if (!this.page) {
      throw new Error('Page not initialized');
    }
    return this.page;
  }

  getCdpPort(): number {
    if (!this.cdpPort) {
      throw new Error('CDP port not initialized');
    }
    return this.cdpPort;
  }

  getContextOptions() {
    return this.contextOptions;
  }

  getBrowser(): Browser {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }
    return this.browser;
  }

  async exportCookies() {
    if (!this.context) {
      throw new Error('Browser context not initialized');
    }
    return this.context.cookies();
  }

  async exportStorage(): Promise<{
    localStorage: Array<{ key: string; value: string }>;
    sessionStorage: Array<{ key: string; value: string }>;
  }> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }
    return this.page.evaluate(() => {
      const localStorageItems = Object.keys(window.localStorage).map((key) => ({
        key,
        value: window.localStorage.getItem(key) ?? ''
      }));
      const sessionStorageItems = Object.keys(window.sessionStorage).map((key) => ({
        key,
        value: window.sessionStorage.getItem(key) ?? ''
      }));
      return {
        localStorage: localStorageItems,
        sessionStorage: sessionStorageItems
      };
    });
  }

}
