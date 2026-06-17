import { SecuritySnippet } from "./securitySnippets";

export const accessibilitySnippets: SecuritySnippet[] = [
  {
    name: "axe-core with Jest (React Testing Library)",
    tool: "jest-axe",
    description: "Run axe accessibility checks on a rendered React component inside a Jest test.",
    code: `import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { LoginForm } from "../components/LoginForm";

expect.extend(toHaveNoViolations);

test("LoginForm has no accessibility violations", async () => {
  const { container } = render(<LoginForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});`,
  },
  {
    name: "Playwright — axe full-page scan",
    tool: "@axe-core/playwright",
    description: "Inject axe into a live browser page via Playwright and assert zero violations.",
    code: `import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home page has no critical a11y violations", async ({ page }) => {
  await page.goto("http://localhost:5173");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();

  // Print violations for easier debugging
  if (results.violations.length) {
    console.table(
      results.violations.map((v) => ({
        id:      v.id,
        impact:  v.impact,
        nodes:   v.nodes.length,
        description: v.description,
      }))
    );
  }

  expect(results.violations).toHaveLength(0);
});`,
  },
  {
    name: "Playwright — keyboard navigation",
    tool: "Playwright",
    description: "Verify that all interactive elements are reachable and activatable via keyboard alone.",
    code: `import { test, expect } from "@playwright/test";

test("nav links are keyboard accessible", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // Move focus to first interactive element
  await page.keyboard.press("Tab");
  const first = page.locator(":focus");
  await expect(first).toBeVisible();

  // Tab through all focusable items and collect hrefs / labels
  const visited: string[] = [];
  for (let i = 0; i < 10; i++) {
    const text = await page.evaluate(
      () => document.activeElement?.textContent?.trim() ?? ""
    );
    visited.push(text);
    await page.keyboard.press("Tab");
  }

  expect(visited).toContain("Home");   // adjust to your app's nav labels
});

test("modal can be closed with Escape", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await page.getByRole("button", { name: /open modal/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});`,
  },
  {
    name: "Lighthouse CI — a11y score gate",
    tool: "Lighthouse CI",
    description: "Block CI if the Lighthouse accessibility score drops below a threshold.",
    code: `# .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:5173/"],
      startServerCommand: "npm run preview",
      numberOfRuns: 2,
    },
    assert: {
      assertions: {
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "color-contrast":           ["warn",  { minScore: 1   }],
        "image-alt":                ["error", { minScore: 1   }],
        "label":                    ["error", { minScore: 1   }],
        "link-name":                ["error", { minScore: 1   }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};

# GitHub Actions step
# - name: Run Lighthouse CI
#   run: |
#     npm install -g @lhci/cli
#     lhci autorun`,
  },
  {
    name: "Storybook — a11y addon per story",
    tool: "@storybook/addon-a11y",
    description: "Attach axe rules to individual stories so accessibility is checked alongside visual snapshots.",
    code: `// Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  component: Button,
  parameters: {
    a11y: {
      // Override axe config for this story
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { label: "Submit", variant: "primary" },
};

// Story-level disable example (e.g. intentional low-contrast demo)
export const LowContrastDemo: Story = {
  args: { label: "Subtle", variant: "ghost" },
  parameters: {
    a11y: { disable: true },
  },
};`,
  },
];
