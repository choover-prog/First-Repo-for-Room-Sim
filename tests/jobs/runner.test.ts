import { describe, it, expect } from "vitest";
import { runJobs } from "../../src/jobs/runner";
import { flags } from "../../src/config/flags";

describe("job runner", () => {
  it("runs scheduled jobs when enabled", async () => {
    flags.jobsEnabled = true;
    const results = await runJobs();
    expect(results.length).toBeGreaterThan(0);
    flags.jobsEnabled = false;
    const resultsOff = await runJobs();
    expect(resultsOff.length).toBe(0);
  });
});
