import { projectStore } from './projectStore';

export function subscribe(fn){
  return projectStore.subscribe(() => fn(getState()));
}

export function getState(){
  const { project } = projectStore.getState();
  return {
    selected: project.selectedId ? { type:'speaker', id: project.selectedId } : null,
    speakers: project.speakers,
  };
}

export function dispatch(action){
  const api = projectStore.getState();
  switch(action.type){
    case 'Select':
      api.dispatch({ type:'selectSpeaker', id: action.payload ? action.payload.id : null });
      break;
    case 'Move':
      if (action.object==='speaker'){
        api.dispatch({ type:'moveSpeaker', id: action.id, pos: action.pos });
      }
      break;
    case 'RotateY':
      api.dispatch({ type:'rotateSpeaker', id: action.id, deg: action.deg, setTo: action.setTo });
      break;
    case 'Delete':
      api.dispatch({ type:'deleteSpeaker', id: action.id });
      break;
    case 'Duplicate':
      api.dispatch({ type:'duplicateSpeaker', id: action.id });
      break;
    case 'Undo':
      api.undo();
      break;
    case 'Redo':
      api.redo();
      break;
  }
}
