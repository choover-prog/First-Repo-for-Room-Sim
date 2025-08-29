import { schedule } from "./schedule";
import { flags } from "../config/flags";
export async function runJobs(){
  if (!flags.jobsEnabled) return [] as string[];
  const results: string[] = [];
  for (const job of schedule){
    const r = await job.task();
    results.push(r);
  }
  return results;
}
