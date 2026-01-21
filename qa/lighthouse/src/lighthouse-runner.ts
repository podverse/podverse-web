import lighthouse from 'lighthouse';
import { BrowserAutomation } from './browser-automation.js';
import type { UserManager, TestUser } from './user-manager.js';
import type { Result as LighthouseResult } from 'lighthouse';

export interface LighthouseScenarioResult {
  homepage?: LighthouseResult;
  podcastChannelPage?: LighthouseResult;
  videoChannelPage?: LighthouseResult;
  musicAlbumPage?: LighthouseResult;
  podcastEpisodePage?: LighthouseResult;
  videoEpisodePage?: LighthouseResult;
  musicTrackPage?: LighthouseResult;
  podcastAfterPlay?: LighthouseResult;
  videoAfterPlay?: LighthouseResult;
  musicAfterPlay?: LighthouseResult;
  podcastAfterReload?: LighthouseResult;
  videoAfterReload?: LighthouseResult;
  musicAfterReload?: LighthouseResult;
}

export interface LighthouseTestResults {
  loggedOut: LighthouseScenarioResult;
  loggedIn: LighthouseScenarioResult;
}

export class LighthouseRunner {
  private readonly medianRuns = Math.max(
    1,
    Number(process.env.LIGHTHOUSE_MEDIAN_RUNS || 5)
  );
  private readonly contextMode = (process.env.LIGHTHOUSE_CONTEXT_MODE || 'fresh').toLowerCase();

  constructor() {
  }

  async runLighthouseOnPage(url: string, port: number): Promise<LighthouseResult> {
    const result = await lighthouse(url, {
      port,
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance'],
      throttlingMethod: 'provided',
      formFactor: 'desktop',
      screenEmulation: {
        mobile: false,
        width: 1366,
        height: 768,
        deviceScaleFactor: 1,
        disabled: false,
      },
      throttling: {
        rttMs: 150,
        throughputKbps: 1638.4,
        requestLatencyMs: 150,
        downloadThroughputKbps: 1638.4,
        uploadThroughputKbps: 768,
        cpuSlowdownMultiplier: 4
      },
      disableStorageReset: true,
      skipAudits: [
        // Skip audits that depend on RootCauses gatherer to suppress warnings
        // These audits fail with "Cannot read properties of undefined (reading 'frame_sequence')"
        'layout-shifts',
        'layout-shift-elements',
        'largest-contentful-paint-element',
        'lcp-lazy-loaded',
        'non-composited-animations',
        'prioritize-lcp-image'
      ]
    });

    if (!result?.lhr) {
      throw new Error(`Lighthouse failed to generate a report for ${url}`);
    }

    return result.lhr;
  }

  private async prepareContext(
    automation: BrowserAutomation,
    url: string
  ) {
    const browser = automation.getBrowser();
    const context = await browser.newContext(automation.getContextOptions());
    await context.setExtraHTTPHeaders({
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache'
    });
    const cookies = await automation.exportCookies();
    if (cookies.length > 0) {
      await context.addCookies(cookies);
    }
    const storage = await automation.exportStorage();
    await context.addInitScript((data) => {
      for (const item of data.localStorage) {
        window.localStorage.setItem(item.key, item.value);
      }
      for (const item of data.sessionStorage) {
        window.sessionStorage.setItem(item.key, item.value);
      }
    }, storage);

    const page = await context.newPage();
    await page.route('**/*', async (route) => {
      const headers = {
        ...route.request().headers(),
        'Cache-Control': 'no-store',
        Pragma: 'no-cache'
      };
      await route.continue({ headers });
    });
    await page.goto(url, { waitUntil: 'networkidle' });

    return { context, page };
  }

  private async runWithFreshContext(
    automation: BrowserAutomation,
    url: string,
    port: number
  ): Promise<LighthouseResult> {
    const { context, page } = await this.prepareContext(automation, url);
    try {
      const currentUrl = page.url();
      return await this.runLighthouseOnPage(currentUrl, port);
    } finally {
      await context.close();
    }
  }

  private getAuditNumericValue(lhr: LighthouseResult, id: string): number | null {
    const value = lhr.audits?.[id]?.numericValue;
    return typeof value === 'number' ? value : null;
  }

  private getCategoryScore(lhr: LighthouseResult, id: string): number | null {
    const score = lhr.categories?.[id]?.score;
    return typeof score === 'number' ? score : null;
  }

  private median(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  }

  private buildMedianLhr(runs: LighthouseResult[]): LighthouseResult {
    const base = runs[0];
    const clone = JSON.parse(JSON.stringify(base)) as LighthouseResult;

    const performanceScores = runs
      .map((lhr) => this.getCategoryScore(lhr, 'performance'))
      .filter((v): v is number => v !== null);
    if (performanceScores.length > 0 && clone.categories?.performance) {
      clone.categories.performance.score = this.median(performanceScores);
    }

    const auditIds = [
      'first-contentful-paint',
      'largest-contentful-paint',
      'speed-index',
      'first-input-delay',
      'max-potential-fid',
      'cumulative-layout-shift',
      'interactive',
      'page-load-time',
      'total-byte-weight',
      'unused-javascript',
      'render-blocking-resources',
      'network-requests',
      'network-rtt'
    ];

    for (const auditId of auditIds) {
      const values = runs
        .map((lhr) => this.getAuditNumericValue(lhr, auditId))
        .filter((v): v is number => v !== null);
      if (values.length > 0 && clone.audits?.[auditId]) {
        clone.audits[auditId].numericValue = this.median(values);
      }
    }

    return clone;
  }

  private async runWithMedian(
    automation: BrowserAutomation,
    url: string,
    port: number
  ): Promise<LighthouseResult> {
    const runs: LighthouseResult[] = [];

    if (this.contextMode === 'single') {
      const { context, page } = await this.prepareContext(automation, url);
      try {
        const session = await context.newCDPSession(page);
        await session.send('Network.enable');
        for (let i = 0; i < this.medianRuns; i++) {
          await session.send('Network.clearBrowserCache');
          const currentUrl = page.url();
          runs.push(await this.runLighthouseOnPage(currentUrl, port));
        }
      } finally {
        await context.close();
      }
    } else {
      for (let i = 0; i < this.medianRuns; i++) {
        runs.push(await this.runWithFreshContext(automation, url, port));
      }
    }

    return this.buildMedianLhr(runs);
  }

  async testLoggedOut(automation: BrowserAutomation): Promise<LighthouseScenarioResult> {
    const results: LighthouseScenarioResult = {};
    console.log('   📋 Running logged-out tests...');

    try {
      // Reuse the Playwright Chromium instance via CDP for Lighthouse
      const port = automation.getCdpPort();
      console.log(`      ✅ Using Playwright Chrome on port ${port}`);

      // Homepage
      console.log('      → Testing homepage...');
      await automation.navigateToHomepage();
      await automation.waitBetweenActions();
      console.log('         Running Lighthouse audit...');
      results.homepage = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);
      console.log('         ✅ Homepage test complete');

      // Podcast channel page
      await automation.navigateToChannel('lhtest-chan-1', false);
      await automation.waitBetweenActions();
      results.podcastChannelPage = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);

      // Video channel page
      await automation.navigateToChannel('lhtest-chan-2', false);
      await automation.waitBetweenActions();
      results.videoChannelPage = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);

      // Music album page
      await automation.navigateToChannel('lhtest-chan-3', true);
      await automation.waitBetweenActions();
      results.musicAlbumPage = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);

      // Podcast episode page
      await automation.navigateToItem('lhtest-item-1', false);
      await automation.waitBetweenActions();
      results.podcastEpisodePage = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);

      // Podcast play and reload
      await automation.clickPlayButton();
      await automation.waitBetweenActions();
      results.podcastAfterPlay = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);
      await automation.reloadPage();
      await automation.waitBetweenActions();
      results.podcastAfterReload = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);

      // Video episode page
      await automation.navigateToItem('lhtest-item-2', false);
      await automation.waitBetweenActions();
      results.videoEpisodePage = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);

      // Video play and reload
      await automation.clickPlayButton();
      await automation.waitBetweenActions();
      results.videoAfterPlay = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);
      await automation.reloadPage();
      await automation.waitBetweenActions();
      results.videoAfterReload = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);

      // Music track page
      await automation.navigateToItem('lhtest-item-3', true);
      await automation.waitBetweenActions();
      results.musicTrackPage = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);

      // Music play and reload
      await automation.clickPlayButton();
      await automation.waitBetweenActions();
      results.musicAfterPlay = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);
      await automation.reloadPage();
      await automation.waitBetweenActions();
      results.musicAfterReload = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);
    } finally {
      // Playwright owns the Chrome lifecycle
    }

    return results;
  }

  async testLoggedIn(automation: BrowserAutomation, userManager: UserManager, testUser: TestUser): Promise<LighthouseScenarioResult> {
    const results: LighthouseScenarioResult = {};
    console.log('   📋 Running logged-in tests...');
    console.log(`      → Using test user: ${testUser.email}`);

    try {
      // Reuse the Playwright Chromium instance via CDP for Lighthouse
      const port = automation.getCdpPort();
      console.log(`      ✅ Using Playwright Chrome on port ${port}`);

      // Login first with test user
      console.log('      → Logging in test user...');
      await automation.clearCookies();
      await automation.navigateToHomepage();
      await automation.login(testUser);
      await automation.waitBetweenActions();
      console.log('      ✅ Test user logged in');

      // Homepage (logged in)
      console.log('      → Testing homepage (logged in)...');
      console.log('         Running Lighthouse audit...');
      results.homepage = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);
      console.log('         ✅ Homepage test complete');

      // Podcast channel page
      console.log('      → Testing podcast channel page (logged in)...');
      await automation.navigateToChannel('lhtest-chan-1', false);
      await automation.waitBetweenActions();
      console.log('         Running Lighthouse audit...');
      results.podcastChannelPage = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);
      console.log('         ✅ Podcast channel test complete');

      // Video channel page
      console.log('      → Testing video channel page (logged in)...');
      await automation.navigateToChannel('lhtest-chan-2', false);
      await automation.waitBetweenActions();
      console.log('         Running Lighthouse audit...');
      results.videoChannelPage = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);
      console.log('         ✅ Video channel test complete');

      // Music album page
      console.log('      → Testing music album page (logged in)...');
      await automation.navigateToChannel('lhtest-chan-3', true);
      await automation.waitBetweenActions();
      console.log('         Running Lighthouse audit...');
      results.musicAlbumPage = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);
      console.log('         ✅ Music album test complete');

      // Podcast episode page
      console.log('      → Testing podcast episode page (logged in)...');
      await automation.navigateToItem('lhtest-item-1', false);
      await automation.waitBetweenActions();
      console.log('         Running Lighthouse audit...');
      results.podcastEpisodePage = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);
      console.log('         ✅ Podcast episode test complete');

      // Podcast play and reload
      console.log('      → Testing podcast play behavior (logged in)...');
      await automation.clickPlayButton();
      await automation.waitBetweenActions();
      console.log('         Running Lighthouse audit after play...');
      results.podcastAfterPlay = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);
      console.log('         → Testing podcast reload behavior (logged in)...');
      await automation.reloadPage();
      await automation.waitBetweenActions();
      console.log('         Running Lighthouse audit after reload...');
      results.podcastAfterReload = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);
      console.log('         ✅ Podcast play/reload tests complete');

      // Video episode page
      console.log('      → Testing video episode page (logged in)...');
      await automation.navigateToItem('lhtest-item-2', false);
      await automation.waitBetweenActions();
      console.log('         Running Lighthouse audit...');
      results.videoEpisodePage = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);
      console.log('         ✅ Video episode test complete');

      // Video play and reload
      console.log('      → Testing video play behavior (logged in)...');
      await automation.clickPlayButton();
      await automation.waitBetweenActions();
      console.log('         Running Lighthouse audit after play...');
      results.videoAfterPlay = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);
      console.log('         → Testing video reload behavior (logged in)...');
      await automation.reloadPage();
      await automation.waitBetweenActions();
      console.log('         Running Lighthouse audit after reload...');
      results.videoAfterReload = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);
      console.log('         ✅ Video play/reload tests complete');

      // Music track page
      console.log('      → Testing music track page (logged in)...');
      await automation.navigateToItem('lhtest-item-3', true);
      await automation.waitBetweenActions();
      console.log('         Running Lighthouse audit...');
      results.musicTrackPage = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);
      console.log('         ✅ Music track test complete');

      // Music play and reload
      console.log('      → Testing music play behavior (logged in)...');
      await automation.clickPlayButton();
      await automation.waitBetweenActions();
      console.log('         Running Lighthouse audit after play...');
      results.musicAfterPlay = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);
      console.log('         → Testing music reload behavior (logged in)...');
      await automation.reloadPage();
      await automation.waitBetweenActions();
      console.log('         Running Lighthouse audit after reload...');
      results.musicAfterReload = await this.runWithMedian(automation, await automation.getCurrentUrl(), port);
      console.log('         ✅ Music play/reload tests complete');
    } finally {
      // Playwright owns the Chrome lifecycle
    }

    return results;
  }

  async runAllTests(automation: BrowserAutomation, userManager: UserManager): Promise<LighthouseTestResults> {
    // Test logged out
    console.log('   🔓 Starting logged-out test suite...');
    await automation.clearCookies();
    const loggedOut = await this.testLoggedOut(automation);

    // Create test user for logged-in tests
    console.log('   👤 Creating test user for logged-in tests...');
    const testUser = await userManager.createTestUser();
    console.log(`   ✅ Test user created: ${testUser.email}\n`);

    try {
      // Test logged in
      console.log('   🔐 Starting logged-in test suite...');
      await automation.clearCookies();
      const loggedIn = await this.testLoggedIn(automation, userManager, testUser);

      return {
        loggedOut,
        loggedIn
      };
    } finally {
      // Always delete the test user after tests complete
      console.log('   🗑️  Cleaning up test user...');
      await userManager.deleteTestUser(testUser);
      console.log('   ✅ Test user deleted\n');
    }
  }
}
