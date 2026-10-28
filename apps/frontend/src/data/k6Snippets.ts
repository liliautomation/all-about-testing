export const k6Snippets: Record<string, string> = {
  "Load Testing": `import http from "k6/http";
import { check, sleep } from "k6";

// Ramp to 100 VUs — normal expected load
export const options = {
  stages: [
    { duration: "1m", target: 100 },  // ramp up
    { duration: "3m", target: 100 },  // hold at peak
    { duration: "1m", target: 0   },  // ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],  // 95th percentile < 500 ms
    http_req_failed:   ["rate<0.01"],  // < 1% error rate
  },
};

export default function () {
  const res = http.get("https://api.example.com/products");
  check(res, { "status 200": (r) => r.status === 200 });
  sleep(1);
}`,

  "Stress Testing": `import http from "k6/http";
import { check, sleep } from "k6";

// Push well beyond normal load to find the breaking point
export const options = {
  stages: [
    { duration: "2m", target: 100  },  // normal load
    { duration: "2m", target: 300  },  // beyond normal
    { duration: "2m", target: 600  },  // stress zone
    { duration: "2m", target: 1000 },  // near breaking point
    { duration: "2m", target: 0    },  // recovery
  ],
};

export default function () {
  const res = http.get("https://api.example.com/products");
  check(res, {
    "status 200":        (r) => r.status === 200,
    "response < 2000ms": (r) => r.timings.duration < 2000,
  });
  sleep(1);
}`,

  "Spike Testing": `import http from "k6/http";
import { check, sleep } from "k6";

// Sudden spike from 10 → 1000 VUs, then back
export const options = {
  stages: [
    { duration: "10s", target: 10   },  // baseline
    { duration: "30s", target: 1000 },  // instant spike
    { duration: "1m",  target: 1000 },  // hold spike
    { duration: "10s", target: 10   },  // drop back
    { duration: "1m",  target: 10   },  // observe recovery
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],  // tolerate up to 5% errors during spike
  },
};

export default function () {
  const res = http.get("https://api.example.com/flash-sale");
  check(res, { "not 5xx": (r) => r.status < 500 });
  sleep(1);
}`,

  "Soak / Endurance Testing": `import http from "k6/http";
import { check, sleep } from "k6";
import { Trend } from "k6/metrics";

const responseTimeTrend = new Trend("response_time_over_time");

// Moderate load held for 4 hours — watch for gradual drift
export const options = {
  stages: [
    { duration: "5m", target: 50 },   // ramp up
    { duration: "4h", target: 50 },   // soak — observe for degradation
    { duration: "5m", target: 0  },   // ramp down
  ],
  thresholds: {
    http_req_duration: ["p(99)<1000"],  // p99 must not degrade over time
  },
};

export default function () {
  const res = http.get("https://api.example.com/dashboard");
  responseTimeTrend.add(res.timings.duration);
  check(res, { "status 200": (r) => r.status === 200 });
  sleep(2);
}`,

  "Volume Testing": `import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 10,
  duration: "2m",
  thresholds: {
    http_req_duration: ["p(95)<5000"],  // bulk ops can be slower
  },
};

// 1000-record payload per request
function buildLargePayload() {
  return JSON.stringify({
    records: Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: \`Item \${i}\`,
      value: Math.random() * 100,
    })),
  });
}

export default function () {
  const res = http.post(
    "https://api.example.com/bulk-import",
    buildLargePayload(),
    { headers: { "Content-Type": "application/json" } }
  );
  check(res, { "accepted": (r) => r.status === 202 || r.status === 200 });
}`,

  "Scalability Testing": `import http from "k6/http";
import { check, sleep } from "k6";

// Step-load: run with 1 pod, then 2, then 4 — compare RPS at each tier
export const options = {
  scenarios: {
    tier_1: { executor: "constant-vus", vus: 50,  duration: "2m", startTime: "0m" },
    tier_2: { executor: "constant-vus", vus: 100, duration: "2m", startTime: "2m" },
    tier_3: { executor: "constant-vus", vus: 200, duration: "2m", startTime: "4m" },
    tier_4: { executor: "constant-vus", vus: 400, duration: "2m", startTime: "6m" },
  },
  thresholds: {
    http_req_duration: ["p(95)<1000"],
    http_req_failed:   ["rate<0.01"],
  },
};

export default function () {
  const res = http.get("https://api.example.com/search?q=test");
  check(res, { "status 200": (r) => r.status === 200 });
  sleep(0.5);
}`,

  "Concurrency Testing": `import http from "k6/http";
import { check } from "k6";

// 200 VUs all hit the same coupon at the same instant
export const options = {
  scenarios: {
    concurrent_burst: {
      executor: "shared-iterations",
      vus: 200,
      iterations: 200,  // each VU fires once — all simultaneously
      maxDuration: "30s",
    },
  },
};

export default function () {
  const res = http.post(
    "https://api.example.com/coupons/SAVE50/redeem",
    JSON.stringify({ userId: \`user_\${__VU}\` }),
    { headers: { "Content-Type": "application/json" } }
  );
  // Only one redemption should succeed — rest should get 409 Conflict
  check(res, {
    "redeemed or conflict": (r) => r.status === 200 || r.status === 409,
    "no 5xx errors":        (r) => r.status < 500,
  });
}`,

  "Chaos / Resilience Testing": `// Requires xk6-disruptor: https://k6.io/docs/javascript-api/xk6-disruptor/
import http from "k6/http";
import { check, sleep } from "k6";
import { PodDisruptor } from "k6/x/disruptor";

export const options = {
  stages: [
    { duration: "1m",  target: 100 },  // steady state
    { duration: "3m",  target: 100 },  // chaos injected via setup()
    { duration: "1m",  target: 100 },  // recovery observation
    { duration: "30s", target: 0   },
  ],
  thresholds: {
    http_req_failed:   ["rate<0.10"],   // allow up to 10% errors during chaos
    http_req_duration: ["p(95)<2000"],  // latency may spike but must recover
  },
};

export function setup() {
  // Kill 50% of HTTP traffic to the "api" pods for 2 minutes
  const disruptor = new PodDisruptor({
    namespace: "default",
    labelSelector: "app=api",
  });
  disruptor.injectHttpFaults({ errorRate: 0.5, duration: "2m" });
}

export default function () {
  const res = http.get("https://api.example.com/health");
  check(res, { "service alive": (r) => r.status === 200 });
  sleep(1);
}`,
};
