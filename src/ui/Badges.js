/**
 * Badges System for Equipment Quality Indicators
 * Integrates with existing persona system to show equipment quality badges
 */

/**
 * Badge configuration for different equipment types
 */
const BADGE_CONFIG = {
  amplifier: {
    tiers: {
      budget: { label: 'Budget', color: '#ff6b6b', icon: '🔊' },
      midrange: { label: 'Mid-Range', color: '#4ecdc4', icon: '🎵' },
      highEnd: { label: 'High-End', color: '#45b7d1', icon: '🎼' },
      reference: { label: 'Reference', color: '#96ceb4', icon: '🏆' }
    },
    criteria: {
      budget: { maxPower: 50, maxPrice: 500 },
      midrange: { maxPower: 150, maxPrice: 2000 },
      highEnd: { maxPower: 300, maxPrice: 8000 },
      reference: { minPower: 300, minPrice: 8000 }
    }
  },
  speaker: {
    tiers: {
      budget: { label: 'Budget', color: '#ff6b6b', icon: '🔊' },
      midrange: { label: 'Mid-Range', color: '#4ecdc4', icon: '🎵' },
      highEnd: { label: 'High-End', color: '#45b7d1', icon: '🎼' },
      reference: { label: 'Reference', color: '#96ceb4', icon: '🏆' }
    },
    criteria: {
      budget: { maxSensitivity: 85, maxPrice: 800 },
      midrange: { maxSensitivity: 90, maxPrice: 3000 },
      highEnd: { maxSensitivity: 95, maxPrice: 12000 },
      reference: { minSensitivity: 95, minPrice: 12000 }
    }
  },
  subwoofer: {
    tiers: {
      budget: { label: 'Budget', color: '#ff6b6b', icon: '🔊' },
      midrange: { label: 'Mid-Range', color: '#4ecdc4', icon: '🎵' },
      highEnd: { label: 'High-End', color: '#45b7d1', icon: '🎼' },
      reference: { label: 'Reference', color: '#96ceb4', icon: '🏆' }
    },
    criteria: {
      budget: { maxFrequency: 35, maxPrice: 600 },
      midrange: { maxFrequency: 25, maxPrice: 2000 },
      highEnd: { maxFrequency: 20, maxPrice: 6000 },
      reference: { minFrequency: 20, minPrice: 6000 }
    }
  }
};

/**
 * Badge class for individual equipment items
 */
export class EquipmentBadge {
  constructor(equipmentData, persona = null) {
    this.equipment = equipmentData;
    this.persona = persona;
    this.tier = this.calculateTier();
    this.badgeElement = null;
  }

  /**
   * Calculate equipment tier based on specifications
   * @returns {string} Tier identifier
   */
  calculateTier() {
    const type = this.equipment.type?.toLowerCase();
    const config = BADGE_CONFIG[type];
    
    if (!config) return 'unknown';
    
    const { criteria } = config;
    const specs = this.equipment.specifications || {};
    
    // Check reference tier first (highest)
    if (this.meetsCriteria(specs, criteria.reference)) {
      return 'reference';
    }
    
    // Check high-end tier
    if (this.meetsCriteria(specs, criteria.highEnd)) {
      return 'highEnd';
    }
    
    // Check mid-range tier
    if (this.meetsCriteria(specs, criteria.midrange)) {
      return 'midrange';
    }
    
    // Default to budget tier
    return 'budget';
  }

  /**
   * Check if equipment meets tier criteria
   * @param {Object} specs - Equipment specifications
   * @param {Object} criteria - Tier criteria
   * @returns {boolean} Whether criteria are met
   */
  meetsCriteria(specs, criteria) {
    for (const [key, value] of Object.entries(criteria)) {
      if (key.startsWith('max') && specs[key.slice(3).toLowerCase()] > value) {
        return false;
      }
      if (key.startsWith('min') && specs[key.slice(3).toLowerCase()] < value) {
        return false;
      }
    }
    return true;
  }

  /**
   * Create badge HTML element
   * @returns {HTMLElement} Badge element
   */
  createBadge() {
    const type = this.equipment.type?.toLowerCase();
    const config = BADGE_CONFIG[type];
    
    if (!config) {
      return this.createUnknownBadge();
    }
    
    const tierConfig = config.tiers[this.tier];
    const badge = document.createElement('div');
    badge.className = 'equipment-badge';
    badge.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      color: white;
      background: ${tierConfig.color};
      border: 1px solid ${tierConfig.color}20;
      cursor: help;
      transition: all 0.2s ease;
    `;
    
    badge.innerHTML = `
      <span>${tierConfig.icon}</span>
      <span>${tierConfig.label}</span>
    `;
    
    // Add tooltip if persona has tooltips enabled
    if (this.persona && this.persona.tooltipsEnabled) {
      badge.title = `${this.equipment.name} - ${tierConfig.label} Tier`;
    }
    
    // Add hover effects
    badge.addEventListener('mouseenter', () => {
      badge.style.transform = 'scale(1.05)';
      badge.style.boxShadow = `0 2px 8px ${tierConfig.color}40`;
    });
    
    badge.addEventListener('mouseleave', () => {
      badge.style.transform = 'scale(1)';
      badge.style.boxShadow = 'none';
    });
    
    this.badgeElement = badge;
    return badge;
  }

  /**
   * Create badge for unknown equipment types
   * @returns {HTMLElement} Unknown badge element
   */
  createUnknownBadge() {
    const badge = document.createElement('div');
    badge.className = 'equipment-badge unknown';
    badge.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      color: white;
      background: #6c757d;
      border: 1px solid #6c757d20;
      cursor: help;
    `;
    
    badge.innerHTML = `
      <span>❓</span>
      <span>Unknown</span>
    `;
    
    if (this.persona && this.persona.tooltipsEnabled) {
      badge.title = `${this.equipment.name} - Unknown Tier`;
    }
    
    this.badgeElement = badge;
    return badge;
  }

  /**
   * Update badge based on new persona settings
   * @param {Object} persona - New persona configuration
   */
  updatePersona(persona) {
    this.persona = persona;
    if (this.badgeElement) {
      // Update tooltip visibility
      if (this.persona && this.persona.tooltipsEnabled) {
        const tierConfig = BADGE_CONFIG[this.equipment.type?.toLowerCase()]?.tiers[this.tier];
        if (tierConfig) {
          this.badgeElement.title = `${this.equipment.name} - ${tierConfig.label} Tier`;
        }
      } else {
        this.badgeElement.title = '';
      }
    }
  }

  /**
   * Get badge data for export
   * @returns {Object} Badge information
   */
  getBadgeData() {
    const type = this.equipment.type?.toLowerCase();
    const config = BADGE_CONFIG[type];
    const tierConfig = config?.tiers[this.tier];
    
    return {
      equipmentId: this.equipment.id,
      equipmentName: this.equipment.name,
      equipmentType: this.equipment.type,
      tier: this.tier,
      tierLabel: tierConfig?.label || 'Unknown',
      tierColor: tierConfig?.color || '#6c757d',
      tierIcon: tierConfig?.icon || '❓',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Badge manager for handling multiple equipment badges
 */
export class BadgeManager {
  constructor(persona = null) {
    this.persona = persona;
    this.badges = new Map();
    this.badgeContainer = null;
  }

  /**
   * Set persona configuration
   * @param {Object} persona - Persona configuration
   */
  setPersona(persona) {
    this.persona = persona;
    // Update all existing badges
    this.badges.forEach(badge => {
      badge.updatePersona(persona);
    });
  }

  /**
   * Add equipment badge
   * @param {Object} equipmentData - Equipment data
   * @returns {EquipmentBadge} Created badge instance
   */
  addBadge(equipmentData) {
    const badge = new EquipmentBadge(equipmentData, this.persona);
    this.badges.set(equipmentData.id, badge);
    return badge;
  }

  /**
   * Remove equipment badge
   * @param {string} equipmentId - Equipment ID
   */
  removeBadge(equipmentId) {
    const badge = this.badges.get(equipmentId);
    if (badge && badge.badgeElement) {
      badge.badgeElement.remove();
    }
    this.badges.delete(equipmentId);
  }

  /**
   * Create badge container
   * @param {HTMLElement} parentElement - Parent element to append to
   * @returns {HTMLElement} Badge container
   */
  createBadgeContainer(parentElement) {
    if (this.badgeContainer) {
      this.badgeContainer.remove();
    }
    
    this.badgeContainer = document.createElement('div');
    this.badgeContainer.className = 'badge-container';
    this.badgeContainer.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 12px 0;
      padding: 12px;
      background: #1a1f29;
      border-radius: 8px;
      border: 1px solid #30384a;
    `;
    
    // Add header
    const header = document.createElement('h3');
    header.textContent = 'Equipment Quality Badges';
    header.style.cssText = `
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #e8eaed;
      width: 100%;
    `;
    this.badgeContainer.appendChild(header);
    
    // Add legend
    this.addLegend();
    
    parentElement.appendChild(this.badgeContainer);
    return this.badgeContainer;
  }

  /**
   * Add legend to badge container
   */
  addLegend() {
    const legend = document.createElement('div');
    legend.className = 'badge-legend';
    legend.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #30384a;
      width: 100%;
    `;
    
    const legendTitle = document.createElement('span');
    legendTitle.textContent = 'Legend: ';
    legendTitle.style.cssText = `
      font-size: 11px;
      color: #b7c1d1;
      margin-right: 8px;
    `;
    legend.appendChild(legendTitle);
    
    // Add tier indicators
    Object.entries(BADGE_CONFIG.amplifier.tiers).forEach(([tier, config]) => {
      const indicator = document.createElement('span');
      indicator.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 2px;
        font-size: 10px;
        color: ${config.color};
        background: ${config.color}20;
        padding: 2px 6px;
        border-radius: 8px;
      `;
      indicator.innerHTML = `${config.icon} ${config.label}`;
      legend.appendChild(indicator);
    });
    
    this.badgeContainer.appendChild(legend);
  }

  /**
   * Render all badges in container
   */
  renderBadges() {
    if (!this.badgeContainer) return;
    
    // Clear existing badges (keep header and legend)
    const header = this.badgeContainer.querySelector('h3');
    const legend = this.badgeContainer.querySelector('.badge-legend');
    this.badgeContainer.innerHTML = '';
    
    if (header) this.badgeContainer.appendChild(header);
    
    // Add badges
    this.badges.forEach(badge => {
      const badgeElement = badge.createBadge();
      this.badgeContainer.appendChild(badgeElement);
    });
    
    if (legend) this.badgeContainer.appendChild(legend);
  }

  /**
   * Get all badge data for export
   * @returns {Array} Array of badge data
   */
  exportBadgeData() {
    return Array.from(this.badges.values()).map(badge => badge.getBadgeData());
  }

  /**
   * Clear all badges
   */
  clear() {
    this.badges.clear();
    if (this.badgeContainer) {
      this.badgeContainer.remove();
      this.badgeContainer = null;
    }
  }
}


export function SpinoramaBadge() {
  const el = document.createElement('span');
  el.className = 'badge spin-verified';
  el.textContent = 'Spinorama Verified';
  el.style.cssText = `display:inline-block;padding:2px 8px;border-radius:999px;background:#3b82f6;color:#0b0d10;font-size:10px;font-weight:600;margin-left:4px`;
  return el;
}
