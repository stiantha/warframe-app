import { WorldstateData, parseWorldstateData } from './worldstateParser';

const WORLDSTATE_API_URL = 'https://api.warframestat.us/pc';

export class WorldstateService {
  private static instance: WorldstateService;
  private cache: WorldstateData | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): WorldstateService {
    if (!WorldstateService.instance) {
      WorldstateService.instance = new WorldstateService();
    }
    return WorldstateService.instance;
  }

  async fetchWorldstate(): Promise<WorldstateData> {
    const now = Date.now();
    
    // Return cached data if it's still valid
    if (this.cache && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.cache;
    }

    try {
      const response = await fetch(WORLDSTATE_API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.cache = parseWorldstateData(data);
      this.lastFetch = now;
      
      return this.cache;
    } catch (error) {
      console.error('Error fetching worldstate data:', error);
      
      // Return cached data if available, even if expired
      if (this.cache) {
        return this.cache;
      }
      
      // Return empty data structure if no cache available
      return {
        timestamp: new Date().toISOString(),
        alerts: [],
        invasions: [],
        sorties: [],
        fissures: [],
        events: [],
        nightwave: [],
      };
    }
  }

  async getAlerts() {
    const worldstate = await this.fetchWorldstate();
    return worldstate.alerts;
  }

  async getInvasions() {
    const worldstate = await this.fetchWorldstate();
    return worldstate.invasions;
  }

  async getSorties() {
    const worldstate = await this.fetchWorldstate();
    return worldstate.sorties;
  }

  async getFissures() {
    const worldstate = await this.fetchWorldstate();
    return worldstate.fissures;
  }

  async getEvents() {
    const worldstate = await this.fetchWorldstate();
    return worldstate.events;
  }

  async getNightwave() {
    const worldstate = await this.fetchWorldstate();
    return worldstate.nightwave;
  }

  clearCache() {
    this.cache = null;
    this.lastFetch = 0;
  }
} 