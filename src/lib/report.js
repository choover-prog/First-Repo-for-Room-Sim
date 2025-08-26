/**
 * Report and Export Library
 * Handles exporting room data, heatmaps, and screenshots
 */

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
  
  return {
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

