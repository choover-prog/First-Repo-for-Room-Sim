// Guard custom element registrations to run only once per element name
export function registerCustomElementsOnce() {
  const defineOnce = (name: string, ctor: any) => {
    if (typeof window !== 'undefined' && !customElements.get(name) && ctor) {
      customElements.define(name, ctor);
    }
  };
  // example: autosize textarea element from external bundle if available
  // @ts-ignore
  defineOnce('mce-autosize-textarea', (window as any)?.MceAutosizeTextareaElement);
}
