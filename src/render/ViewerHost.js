export function mountViewerHost(target, element = document.getElementById('view')){
  if(element && target && element.parentNode !== target){
    target.appendChild(element);
  }
  return element;
}
