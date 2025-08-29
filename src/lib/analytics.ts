export function track(event: string, payload: any = {}){
  if (import.meta?.env?.VITE_PRIVACY_OPTIN_ANALYTICS !== "true") return;
  console.log("[analytics]", event, payload);
}
