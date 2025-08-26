#!/usr/bin/env node

/**
 * Spinorama Import Tool
 * Imports CSV data for speaker measurements and converts to JSON format
 * 
 * Usage: node import_spinorama.mjs <input.csv> [output.json]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parse CSV line with proper handling of quoted fields
 * @param {string} line - CSV line to parse
 * @returns {Array} Array of field values
 */
function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  fields.push(current.trim());
  
  return fields;
}

/**
 * Parse CSV file and convert to structured data
 * @param {string} csvContent - Raw CSV content
 * @returns {Object} Parsed spinorama data
 */
function parseSpinoramaCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header and one data row');
  }
  
  // Parse header
  const header = parseCSVLine(lines[0]);
  
  // Validate header structure
  const requiredColumns = ['Frequency', '0°', '15°', '30°', '45°', '60°', '75°', '90°'];
  const missingColumns = requiredColumns.filter(col => !header.includes(col));
  
  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }
  
  // Parse data rows
  const measurements = [];
  const frequencies = [];
  
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    
    if (fields.length !== header.length) {
      console.warn(`Warning: Row ${i + 1} has ${fields.length} fields, expected ${header.length}`);
      continue;
    }
    
    const frequency = parseFloat(fields[header.indexOf('Frequency')]);
    
    if (isNaN(frequency) || frequency <= 0) {
      console.warn(`Warning: Invalid frequency at row ${i + 1}: ${fields[header.indexOf('Frequency')]}`);
      continue;
    }
    
    frequencies.push(frequency);
    
    const measurement = {
      frequency,
      angles: {}
    };
    
    // Parse angle measurements
    for (const angle of ['0°', '15°', '30°', '45°', '60°', '75°', '90°']) {
      const value = parseFloat(fields[header.indexOf(angle)]);
      if (!isNaN(value)) {
        measurement.angles[angle] = value;
      }
    }
    
    measurements.push(measurement);
  }
  
  // Sort by frequency
  measurements.sort((a, b) => a.frequency - b.frequency);
  
  return {
    metadata: {
      type: 'spinorama',
      version: '1.0.0',
      importDate: new Date().toISOString(),
      frequencyRange: {
        min: Math.min(...frequencies),
        max: Math.max(...frequencies)
      },
      measurementCount: measurements.length
    },
    measurements,
    angles: ['0°', '15°', '30°', '45°', '60°', '75°', '90°']
  };
}

/**
 * Convert frequency response data to room simulator format
 * @param {Object} spinoramaData - Parsed spinorama data
 * @returns {Object} Room simulator compatible format
 */
function convertToRoomSimFormat(spinoramaData) {
  const { measurements, angles } = spinoramaData;
  
  // Calculate average response for each frequency
  const averageResponse = measurements.map(m => {
    const values = Object.values(m.angles).filter(v => !isNaN(v));
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    return {
      frequency: m.frequency,
      average: average,
      angles: m.angles
    };
  });
  
  // Calculate frequency response statistics
  const responses = averageResponse.map(r => r.average);
  const minResponse = Math.min(...responses);
  const maxResponse = Math.max(...responses);
  const avgResponse = responses.reduce((sum, r) => sum + r, 0) / responses.length;
  
  return {
    speaker: {
      type: 'imported_spinorama',
      name: 'Imported Spinorama Data',
      specifications: {
        frequencyResponse: {
          range: spinoramaData.metadata.frequencyRange,
          average: avgResponse,
          min: minResponse,
          max: maxResponse
        },
        angles: angles,
        measurementCount: spinoramaData.metadata.measurementCount
      }
    },
    measurements: averageResponse,
    metadata: {
      ...spinoramaData.metadata,
      converted: true,
      conversionDate: new Date().toISOString()
    }
  };
}

/**
 * Main import function
 * @param {string} inputFile - Input CSV file path
 * @param {string} outputFile - Output JSON file path (optional)
 */
async function importSpinorama(inputFile, outputFile = null) {
  try {
    console.log(`Importing spinorama data from: ${inputFile}`);
    
    // Read input file
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Input file not found: ${inputFile}`);
    }
    
    const csvContent = fs.readFileSync(inputFile, 'utf8');
    
    // Parse CSV
    console.log('Parsing CSV data...');
    const spinoramaData = parseSpinoramaCSV(csvContent);
    console.log(`Parsed ${spinoramaData.measurements.length} frequency measurements`);
    
    // Convert to room simulator format
    console.log('Converting to room simulator format...');
    const roomSimData = convertToRoomSimFormat(spinoramaData);
    
    // Determine output file
    if (!outputFile) {
      const baseName = path.basename(inputFile, path.extname(inputFile));
      outputFile = `${baseName}_converted.json`;
    }
    
    // Write output file
    const outputPath = path.resolve(outputFile);
    fs.writeFileSync(outputPath, JSON.stringify(roomSimData, null, 2));
    
    console.log(`Successfully exported to: ${outputPath}`);
    console.log(`Frequency range: ${spinoramaData.metadata.frequencyRange.min}Hz - ${spinoramaData.metadata.frequencyRange.max}Hz`);
    console.log(`Measurement angles: ${spinoramaData.angles.join(', ')}`);
    
  } catch (error) {
    console.error('Import failed:', error.message);
    process.exit(1);
  }
}

/**
 * Display usage information
 */
function showUsage() {
  console.log(`
Spinorama Import Tool
=====================

Usage: node import_spinorama.mjs <input.csv> [output.json]

Arguments:
  input.csv    Input CSV file with spinorama measurements
  output.json  Output JSON file (optional, defaults to <input>_converted.json)

CSV Format:
  - Must include columns: Frequency, 0°, 15°, 30°, 45°, 60°, 75°, 90°
  - Frequency values in Hz
  - Measurement values in dB SPL
  - First row should be header
  - Data starts from second row

Example:
  node import_spinorama.mjs speaker_measurements.csv speaker_data.json
`);
}

// Main execution
if (process.argv.length < 3) {
  showUsage();
  process.exit(1);
}

const inputFile = process.argv[2];
const outputFile = process.argv[3] || null;

importSpinorama(inputFile, outputFile);
