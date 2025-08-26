import * as THREE from 'three';

/**
 * LF Heatmap Layer for Three.js
 * Renders low-frequency response heatmap as a visual overlay
 */
export class LFHeatmapLayer {
  constructor(scene, resolution = 32) {
    this.scene = scene;
    this.resolution = resolution;
    this.heatmapGroup = null;
    this.isVisible = false;
    // Default dimensions in feet, converted to meters for calculations
    this.currentDimensions = { 
      length: 26.25, // 26.25 feet = 8 meters
      width: 19.69,  // 19.69 feet = 6 meters  
      height: 7.87   // 7.87 feet = 2.4 meters
    };
    
    this.createHeatmapGroup();
  }

  /**
   * Create the heatmap visualization group
   */
  createHeatmapGroup() {
    this.heatmapGroup = new THREE.Group();
    this.heatmapGroup.name = 'LFHeatmap';
    this.scene.add(this.heatmapGroup);
  }

  /**
   * Update room dimensions and regenerate heatmap
   * @param {number} length - Room length in feet
   * @param {number} width - Room width in feet
   * @param {number} height - Room height in feet
   */
  updateDimensions(length, width, height) {
    // Convert feet to meters for calculations
    const feetToMeters = 0.3048;
    this.currentDimensions = { 
      length: length * feetToMeters, 
      width: width * feetToMeters, 
      height: height * feetToMeters 
    };
    
    if (this.isVisible) {
      this.generateHeatmap();
    }
  }

  /**
   * Generate and display the heatmap
   */
  generateHeatmap() {
    // Clear existing heatmap
    this.clearHeatmap();
    
    // Create a simple placeholder heatmap for now
    this.createSimpleHeatmap();
  }

  /**
   * Create a simple placeholder heatmap
   */
  createSimpleHeatmap() {
    const { length, width } = this.currentDimensions;
    
    // Create a simple grid of spheres
    const geometry = new THREE.SphereGeometry(0.05, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      color: 0x4cc3ff,
      transparent: true,
      opacity: 0.7
    });
    
    // Add spheres in a grid pattern
    for (let i = 0; i < this.resolution; i++) {
      for (let j = 0; j < this.resolution; j++) {
        const x = (i / this.resolution - 0.5) * length;
        const z = (j / this.resolution - 0.5) * width;
        const y = 0.1; // Slightly above floor
        
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(x, y, z);
        this.heatmapGroup.add(sphere);
      }
    }
    
    // Add floor grid overlay
    this.createFloorGrid();
  }

  /**
   * Create floor grid overlay for better visualization
   */
  createFloorGrid() {
    const { length, width } = this.currentDimensions;
    
    // Create grid lines
    const gridMaterial = new THREE.LineBasicMaterial({ 
      color: 0x444444, 
      transparent: true, 
      opacity: 0.3 
    });
    
    // Vertical lines (along length)
    for (let i = 0; i <= this.resolution; i++) {
      const x = (i / this.resolution - 0.5) * length;
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, 0.01, -width/2),
        new THREE.Vector3(x, 0.01, width/2)
      ]);
      const line = new THREE.Line(geometry, gridMaterial);
      this.heatmapGroup.add(line);
    }
    
    // Horizontal lines (along width)
    for (let i = 0; i <= this.resolution; i++) {
      const z = (i / this.resolution - 0.5) * width;
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-length/2, 0.01, z),
        new THREE.Vector3(length/2, 0.01, z)
      ]);
      const line = new THREE.Line(geometry, gridMaterial);
      this.heatmapGroup.add(line);
    }
  }

  /**
   * Show the heatmap
   */
  show() {
    this.isVisible = true;
    this.heatmapGroup.visible = true;
    this.generateHeatmap();
  }

  /**
   * Hide the heatmap
   */
  hide() {
    this.isVisible = false;
    this.heatmapGroup.visible = false;
  }

  /**
   * Toggle heatmap visibility
   */
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
    return this.isVisible;
  }

  /**
   * Clear all heatmap elements
   */
  clearHeatmap() {
    while (this.heatmapGroup.children.length > 0) {
      const child = this.heatmapGroup.children[0];
      this.heatmapGroup.remove(child);
      
      // Dispose of geometries and materials
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  }

  /**
   * Get current heatmap state
   * @returns {Object} Heatmap state information
   */
  getState() {
    // Convert back to feet for display
    const metersToFeet = 3.28084;
    return {
      isVisible: this.isVisible,
      dimensions: { 
        length: this.currentDimensions.length * metersToFeet,
        width: this.currentDimensions.width * metersToFeet,
        height: this.currentDimensions.height * metersToFeet
      },
      resolution: this.resolution
    };
  }

  /**
   * Dispose of resources
   */
  dispose() {
    this.clearHeatmap();
    if (this.heatmapGroup) {
      this.scene.remove(this.heatmapGroup);
      this.heatmapGroup = null;
    }
  }
}
