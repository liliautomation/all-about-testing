---
description: "Generate a tailored test strategy from project requirements using this repo's testing knowledge"
name: "Test Strategy Generator"
argument-hint: "Paste your project requirements here"
agent: "agent"
tools: ["search", "fetch", "codebase"]
---

You are a senior QA architect. Given the project requirements below, produce a **complete, actionable test strategy** document.

## Project Requirements

${input:requirements:Paste your project description, tech stack, user stories, or acceptance criteria here}

---

## Instructions

### Step 1 — Analyse the requirements
Identify the key risk areas, user journeys, data flows, and integrations described in the requirements.

### Step 2 — Map to strategies and test types from this repo
Consult the following repo sources first. They are the primary knowledge base:

- **Test strategies** (TDD, BDD, ATDD, Test Pyramid, Shift-Left, etc.): [strategiesService.ts](../../backend/src/services/strategiesService.ts)
- **Test types and best practices** (Unit, Integration, E2E, Contract, Performance, Security, Accessibility): [checklistService.ts](../../backend/src/services/checklistService.ts)
- **What to automate and when**: [AutomationDecisionPage.tsx](../../frontend/src/components/AutomationDecisionPage.tsx)
- **Test data management patterns**: [TestDataManagementPage.tsx](../../frontend/src/components/TestDataManagementPage.tsx)
- **Accessibility test snippets**: [accessibilitySnippets.ts](../../frontend/src/data/accessibilitySnippets.ts)
- **Contract test snippets**: [contractSnippets.ts](../../frontend/src/data/contractSnippets.ts)
- **Performance test snippets (k6)**: [k6Snippets.ts](../../frontend/src/data/k6Snippets.ts)
- **Security test snippets**: [securitySnippets.ts](../../frontend/src/data/securitySnippets.ts)

### Step 3 — Search online for gaps
If the requirements mention a technology, framework, or testing domain **not covered in the repo files above**, use the `search` or `fetch` tool to find current best practices online before recommending an approach. State clearly when you have done this.

---

## Output Format

Produce the strategy as a structured Markdown document with the following sections:

### 1. Project Summary
Brief restatement of what the system does and its key quality risks.

### 2. Recommended Test Strategy
Name the primary strategy (e.g. Test Pyramid, Shift-Left, BDD) and explain why it fits this project.

### 3. Test Types & Coverage Plan
A table or list covering each layer:

| Layer | Type | Scope | Tooling | Priority |
|-------|------|-------|---------|----------|
| ...   | ...  | ...   | ...     | ...      |

Include at minimum: Unit, Integration, E2E, and any specialised types relevant to the project (Contract, Performance, Security, Accessibility).

### 4. Automation Decision
Using the Automate Now / Automate Later / Keep Manual framework, list concrete examples from the requirements in each bucket.

### 5. Test Data Strategy
Recommend a test data approach (factories, fixtures, seeded DB, mocked APIs, etc.) based on the system's data complexity.

### 6. CI/CD Integration
Suggest where each test layer should run (pre-commit, PR, nightly, release) and the recommended gate for each.

### 7. Tooling Recommendations
List specific tools for each test type, drawn from the repo's curated tool lists wherever possible. Add alternatives with links when searching online.

### 8. Risks & Gaps
Highlight areas where test coverage is difficult (e.g. third-party dependencies, non-deterministic data, legacy code) and how to mitigate them.

### 9. References
- Cite repo files used (with relative paths)
- Cite any external URLs found via online search, clearly marked as **[Online source]**
