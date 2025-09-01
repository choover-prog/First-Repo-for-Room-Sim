export interface ExportEntity {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  clamped?: boolean;
}

export interface ExportData {
  schemaVersion: '1.1';
  overlays: { ceilingOpacity: number };
  entities: ExportEntity[];
}

export const CURRENT_SCHEMA_VERSION = '1.1';
