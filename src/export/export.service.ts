import { CURRENT_SCHEMA_VERSION, ExportData } from './schema';
import { getOverlays } from '../state/overlays.slice';

export function exportScene(): ExportData {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    overlays: { ceilingOpacity: getOverlays().ceilingOpacity },
    entities: [],
  };
}
