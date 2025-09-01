import { CURRENT_SCHEMA_VERSION, ExportData } from './schema';
import { setCeilingOpacity } from '../state/overlays.slice';

export function importScene(data: ExportData){
  if (data.schemaVersion !== CURRENT_SCHEMA_VERSION){
    console.warn('Unexpected schema version', data.schemaVersion);
  }
  if (data.overlays){
    setCeilingOpacity(data.overlays.ceilingOpacity);
  }
  // entities restoration placeholder
}
