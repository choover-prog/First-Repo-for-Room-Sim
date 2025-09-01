export function registerCustomElementsOnce(){
  const name = 'mce-autosize-textarea';
  if(typeof window !== 'undefined' && !customElements.get(name)){
    const ctor = (window as any).MceAutosizeTextareaElement || class extends HTMLElement {};
    customElements.define(name, ctor);
  }
}
