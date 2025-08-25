import { flags } from '../config/flags.js';
import { catalogRefresh } from './tasks/catalog_refresh.js';
import { contentGen } from './tasks/content_gen.js';
import { summary } from './tasks/summary.js';

export function startJobs(){
  if(!flags.jobsEnabled) return;
  console.log('[jobs] runner started');
  const run = async ()=>{
    console.log('[jobs] tick');
    await catalogRefresh();
    await contentGen();
    await summary();
  };
  run();
  setInterval(run, 10*60*1000);
}
