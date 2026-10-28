import { Page, APIRequestContext } from "@playwright/test";

/** Domains that block all automated requests but are known-valid in a browser. */
export const BOT_BLOCKED_DOMAINS = new Set(["portswigger.net"]);

/** Collect all unique http(s) hrefs from the current page. */
export async function collectExternalHrefs(page: Page): Promise<string[]> {
  const hrefs = await page.$$eval("a[href]", (anchors) =>
    anchors
      .map((a) => (a as HTMLAnchorElement).href)
      .filter((href) => href.startsWith("http")),
  );
  return [...new Set(hrefs)];
}

/** HEAD-request a URL; falls back to GET if HEAD is not supported (405/501). */
export async function checkUrl(
  request: APIRequestContext,
  url: string,
): Promise<{ url: string; status: number }> {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  };
  try {
    let response = await request.head(url, { timeout: 15_000, headers });
    if (response.status() === 405 || response.status() === 501) {
      response = await request.get(url, { timeout: 15_000, headers });
    }
    return { url, status: response.status() };
  } catch {
    return { url, status: 0 };
  }
}

/**
 * Navigate to a page via the home card, assert all external links return
 * non-404 responses, then return the broken/skipped summary.
 */
export async function checkLinksOnPage(
  page: Page,
  request: APIRequestContext,
  navigateFn: () => Promise<void>,
  pageLabel: string,
): Promise<void> {
  await navigateFn();
  await page.waitForSelector("a[href^='http']", { timeout: 15_000 });

  const hrefs = await collectExternalHrefs(page);
  const { expect } = await import("@playwright/test");
  expect(
    hrefs.length,
    `Expected at least one external link on ${pageLabel}`,
  ).toBeGreaterThan(0);

  const checkable = hrefs.filter((url) => {
    const { hostname } = new URL(url);
    return !BOT_BLOCKED_DOMAINS.has(hostname);
  });

  const results = await Promise.all(
    checkable.map((url) => checkUrl(request, url)),
  );

  const broken = results.filter((r) => r.status === 404);
  expect(
    broken,
    `Found broken links on ${pageLabel}:\n${broken.map((r) => `  [${r.status}] ${r.url}`).join("\n")}`,
  ).toHaveLength(0);

  const skipped = results.filter((r) => r.status === 0);
  if (skipped.length > 0) {
    console.warn(
      `Skipped (network error/timeout) on ${pageLabel}:\n${skipped.map((r) => `  ${r.url}`).join("\n")}`,
    );
  }
}
