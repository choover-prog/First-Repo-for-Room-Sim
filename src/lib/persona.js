const KEY = 'app.persona';
export function getPersona() {
  return localStorage.getItem(KEY) || 'diy'; // casual|diy|pro|reviewer
}
export function setPersona(id) {
  localStorage.setItem(KEY, id);
}
