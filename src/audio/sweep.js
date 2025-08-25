export function playSweep(){
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(20, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(20000, ctx.currentTime + 2);
  osc.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 2);
}
