export function redact(str){
  if(!str) return str;
  return str.replace(/[A-Za-z0-9_\-]{16,}/g,'[redacted]');
}
