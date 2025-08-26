/**
 * LF Heatmap Library
 * Calculates low-frequency response heatmaps for room acoustics
 */

/**
 * Compute low-frequency heatmap for a room
 * @param {number} length - Room length in meters
 * @param {number} width - Room width in meters  
 * @param {number} height - Room height in meters
 * @param {number} resolution - Grid resolution (default: 32)
 * @returns {Object} Heatmap data with positions and values
 */
export function computeHeatmap(length, width, height, resolution = 32) {
  const heatmap = {
    positions: [],
    values: [],
    dimensions: { length, width, height, resolution }
  };

  // Calculate grid spacing
  const stepX = length / (resolution - 1);
  const stepZ = width / (resolution - 1);
  
  // Generate grid positions and calculate LF response
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const x = (i * stepX) - (length / 2);
      const z = (j * stepZ) - (width / 2);
      const y = 0.1; // Slightly above floor level
      
      // Calculate LF response based on room modes
      const value = calculateLFResponse(x, y, z, length, width, height);
      
      heatmap.positions.push(x, y, z);
      heatmap.values.push(value);
    }
  }

  return heatmap;
}

/**
 * Calculate low-frequency response at a specific position
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate  
 * @param {number} z - Z coordinate
 * @param {number} length - Room length
 * @param {number} width - Room width
 * @param {number} height - Room height
 * @returns {number} LF response value (0-1)
 */
function calculateLFResponse(x, y, z, length, width, height) {
  // Calculate room mode contributions
  // Using simplified modal analysis for 20-200 Hz range
  
  let response = 0;
  const frequencies = [20, 40, 60, 80, 100, 120, 140, 160, 180, 200];
  
  for (const freq of frequencies) {
    // Calculate modal pressure at position
    const modalPressure = calculateModalPressure(x, y, z, length, width, height, freq);
    response += modalPressure;
  }
  
  // Normalize to 0-1 range
  return Math.max(0, Math.min(1, response / frequencies.length));
}

/**
 * Calculate modal pressure contribution
 * @param {number} x, y, z - Position coordinates
 * @param {number} length, width, height - Room dimensions
 * @param {number} frequency - Frequency in Hz
 * @returns {number} Modal pressure value
 */
function calculateModalPressure(x, y, z, length, width, height, frequency) {
  const c = 343; // Speed of sound in air (m/s)
  
  // Calculate modal numbers (simplified - just first few modes)
  const modes = [
    { nx: 1, ny: 0, nz: 0 },
    { nx: 0, ny: 1, nz: 0 },
    { nx: 0, ny: 0, nz: 1 },
    { nx: 1, ny: 1, nz: 0 },
    { nx: 1, ny: 0, nz: 1 }
  ];
  
  let pressure = 0;
  
  for (const mode of modes) {
    const modalFreq = (c / 2) * Math.sqrt(
      Math.pow(mode.nx / length, 2) + 
      Math.pow(mode.ny / height, 2) + 
      Math.pow(mode.nz / width, 2)
    );
    
    // Calculate modal shape function
    const shape = Math.cos(Math.PI * mode.nx * (x + length/2) / length) *
                  Math.cos(Math.PI * mode.ny * (y + height/2) / height) *
                  Math.cos(Math.PI * mode.nz * (z + width/2) / width);
    
    // Add contribution with frequency-dependent weighting
    const weight = 1 / (1 + Math.pow((frequency - modalFreq) / 10, 2));
    pressure += weight * shape;
  }
  
  return pressure;
}

/**
 * Normalize heatmap values to a specific range
 * @param {Array} values - Array of heatmap values
 * @param {number} min - Minimum value (default: 0)
 * @param {number} max - Maximum value (default: 1)
 * @returns {Array} Normalized values
 */
export function normalizeHeatmap(values, min = 0, max = 1) {
  if (values.length === 0) return values;
  
  const currentMin = Math.min(...values);
  const currentMax = Math.max(...values);
  const range = currentMax - currentMin;
  
  if (range === 0) {
    return values.map(() => (min + max) / 2);
  }
  
  return values.map(value => {
    const normalized = (value - currentMin) / range;
    return min + normalized * (max - min);
  });
}

/**
 * Get color for a heatmap value
 * @param {number} value - Normalized value (0-1)
 * @returns {string} CSS color string
 */
export function getHeatmapColor(value) {
  // Create a heatmap color gradient from blue (cold) to red (hot)
  const hue = (1 - value) * 240; // 240 = blue, 0 = red
  const saturation = 80 + (value * 20); // 80-100%
  const lightness = 40 + (value * 30); // 40-70%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

