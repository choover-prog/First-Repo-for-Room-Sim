/**
 * Report and Export Library
 * Handles exporting room data, heatmaps, and screenshots
 */
import jsPDF from './jspdf-stub.js';

// Hooks allow modules to contribute extra data to exports
const exportHooks = [];
export function registerExportHook(fn) {
  if (typeof fn === 'function') exportHooks.push(fn);
}

function runExportHooks(target) {
  exportHooks.forEach(fn => {
    try {
      const res = fn();
      if (res && typeof res === 'object') Object.assign(target, res);
    } catch (e) {
      console.warn('export hook failed', e);
    }
  });
}

/**
 * Capture canvas as PNG and return as blob
 * @param {HTMLCanvasElement} canvas - Canvas element to capture
 * @param {string} filename - Default filename for download
 * @returns {Promise<Blob>} PNG blob data
 */
export async function captureCanvasPNG(canvas, filename = 'room-screenshot.png') {
  try {
    // Convert canvas to blob
    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/png', 1.0);
    });
    
    if (!blob) {
      throw new Error('Failed to capture canvas');
    }
    
    return blob;
  } catch (error) {
    console.error('Canvas capture failed:', error);
    throw error;
  }
}

/**
 * Download a blob as a file
 * @param {Blob} blob - Blob data to download
 * @param {string} filename - Filename for the download
 */
export function downloadBlobURL(blob, filename) {
  try {
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
}

/**
 * Download JSON data as a file
 * @param {Object} data - Data object to export
 * @param {string} filename - Filename for the download
 */
export function downloadJSON(data, filename) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadBlobURL(blob, filename);
  } catch (error) {
    console.error('JSON export failed:', error);
    throw error;
  }
}

/**
 * Export room data and measurements
 * @param {Object} roomData - Room dimensions and settings
 * @param {Object} heatmapData - Heatmap state and data
 * @param {Array} measurements - Array of measurements
 * @param {Object} equipment - Equipment configuration
 * @returns {Object} Complete export data
 */
export function generateRoomReport(roomData, heatmapData, measurements, equipment) {
  const timestamp = new Date().toISOString();
  const report = {
    metadata: {
      exportDate: timestamp,
      version: '1.0.0',
      application: 'Room Simulator'
    },
    room: {
      dimensions: roomData,
      timestamp: timestamp
    },
    heatmap: heatmapData,
    measurements: measurements.map(m => ({
      pointA: { x: m.pointA.x, y: m.pointA.y, z: m.pointA.z },
      pointB: { x: m.pointB.x, y: m.pointB.y, z: m.pointB.z },
      distance: m.distance,
      units: m.units,
      timestamp: m.timestamp
    })),
    equipment: equipment,
    settings: {
      units: 'meters',
      gridVisible: true,
      axesVisible: true
    }
  };

  runExportHooks(report);
  return report;
}

/**
 * Export heatmap data for external analysis
 * @param {Object} heatmapData - Heatmap data from LFHeatmapLayer
 * @param {string} filename - Filename for export
 */
export function exportHeatmapData(heatmapData, filename = 'heatmap-data.json') {
  const exportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      type: 'LF Heatmap Data',
      version: '1.0.0'
    },
    heatmap: {
      dimensions: heatmapData.dimensions,
      resolution: heatmapData.resolution,
      positions: heatmapData.positions,
      values: heatmapData.values,
      normalized: heatmapData.normalized || []
    },
    analysis: {
      minValue: Math.min(...heatmapData.values),
      maxValue: Math.max(...heatmapData.values),
      averageValue: heatmapData.values.reduce((a, b) => a + b, 0) / heatmapData.values.length
    }
  };
  
  downloadJSON(exportData, filename);
}

/**
 * Export measurement data as CSV
 * @param {Array} measurements - Array of measurements
 * @param {string} filename - Filename for export
 */
export function exportMeasurementsCSV(measurements, filename = 'measurements.csv') {
  try {
    // Create CSV header
    let csvContent = 'Point A X,Point A Y,Point A Z,Point B X,Point B Y,Point B Z,Distance,Units,Timestamp\n';
    
    // Add measurement rows
    measurements.forEach(m => {
      const row = [
        m.pointA.x.toFixed(3),
        m.pointA.y.toFixed(3),
        m.pointA.z.toFixed(3),
        m.pointB.x.toFixed(3),
        m.pointB.y.toFixed(3),
        m.pointB.z.toFixed(3),
        m.distance.toFixed(3),
        m.units,
        m.timestamp
      ].join(',');
      
      csvContent += row + '\n';
    });
    
    // Create and download blob
    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadBlobURL(blob, filename);
  } catch (error) {
    console.error('CSV export failed:', error);
    throw error;
  }
}

// Simple PDF export using jsPDF
export async function exportPDF(canvas, selections = {}, filename = 'room-report.pdf') {
  try {
    const pdf = new jsPDF();
    const img = canvas.toDataURL('image/png');
    pdf.addImage(img, 'PNG', 10, 10, 180, 100);
    const lines = Object.entries(selections).map(([k,v]) => `${k}: ${v}`);
    pdf.text(lines, 10, 120);
    pdf.save(filename);
  } catch (e) {
    console.error('PDF export failed:', e);
  }
}

