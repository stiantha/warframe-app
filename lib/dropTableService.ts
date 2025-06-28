import { DropTableData, parseDropTableData, searchItems, searchRelics } from './dropTableParser';
import { Item } from '../models/item';
import { Relic } from '../models/relic';

interface MockData {
  items: Array<{
    id: string;
    name: string;
    type: string;
    rarity: string;
    mastery: number;
    description: string;
  }>;
  relics: Array<{
    id: string;
    name: string;
    tier: string;
    era: string;
    vaulted: boolean;
    rewards: Array<{
      item: string;
      rarity: string;
      chance: number;
    }>;
  }>;
  itemDrops: Array<{
    item: {
      id: string;
      name: string;
      type: string;
      rarity: string;
      mastery: number;
    };
    location: string;
    chance: number;
  }>;
  relicDrops: Array<{
    relic: {
      id: string;
      name: string;
      tier: string;
      era: string;
      vaulted: boolean;
      rewards: Array<{
        item: string;
        rarity: string;
        chance: number;
      }>;
    };
    location: string;
    chance: number;
  }>;
}

export class DropTableService {
  private static instance: DropTableService;
  private data: DropTableData | null = null;
  private lastLoad: number = 0;
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  private constructor() {}

  static getInstance(): DropTableService {
    if (!DropTableService.instance) {
      DropTableService.instance = new DropTableService();
    }
    return DropTableService.instance;
  }

  async loadDropTableData(): Promise<DropTableData> {
    const now = Date.now();
    
    // Return cached data if it's still valid
    if (this.data && (now - this.lastLoad) < this.CACHE_DURATION) {
      return this.data;
    }

    try {
      // For now, we'll use mock data. In a real implementation, this would fetch from an API
      const mockData = await this.getMockData();
      this.data = parseDropTableData(mockData);
      this.lastLoad = now;
      
      return this.data;
    } catch (error) {
      console.error('Error loading drop table data:', error);
      
      return {
        items: [],
        relics: [],
        itemDrops: [],
        relicDrops: [],
      };
    }
  }

  async searchItems(query: string): Promise<Item[]> {
    const data = await this.loadDropTableData();
    return searchItems(data.items, query);
  }

  async searchRelics(query: string): Promise<Relic[]> {
    const data = await this.loadDropTableData();
    return searchRelics(data.relics, query);
  }

  async getAllItems(): Promise<Item[]> {
    const data = await this.loadDropTableData();
    return data.items;
  }

  async getAllRelics(): Promise<Relic[]> {
    const data = await this.loadDropTableData();
    return data.relics;
  }

  private async getMockData(): Promise<MockData> {
    // Mock data for demonstration purposes
    return {
      items: [
        {
          id: 'excalibur_prime',
          name: 'Excalibur Prime',
          type: 'Warframe',
          rarity: 'Legendary',
          mastery: 0,
          description: 'The first Prime Warframe, available only to Founders',
        },
        {
          id: 'forma',
          name: 'Forma',
          type: 'Resource',
          rarity: 'Uncommon',
          mastery: 0,
          description: 'Used to polarize equipment slots',
        },
        {
          id: 'serration',
          name: 'Serration',
          type: 'Mod',
          rarity: 'Common',
          mastery: 0,
          description: 'Increases rifle damage',
        },
        {
          id: 'orokin_cell',
          name: 'Orokin Cell',
          type: 'Resource',
          rarity: 'Uncommon',
          mastery: 0,
          description: 'Advanced Orokin technology component',
        },
        {
          id: 'neural_sensor',
          name: 'Neural Sensor',
          type: 'Resource',
          rarity: 'Rare',
          mastery: 0,
          description: 'Advanced Corpus neural technology',
        },
        {
          id: 'rhino_prime',
          name: 'Rhino Prime',
          type: 'Warframe',
          rarity: 'Rare',
          mastery: 0,
          description: 'Prime version of the Rhino Warframe',
        },
        {
          id: 'boltor_prime',
          name: 'Boltor Prime',
          type: 'Weapon',
          rarity: 'Rare',
          mastery: 14,
          description: 'Prime version of the Boltor assault rifle',
        },
      ],
      relics: [
        {
          id: 'lith_a1',
          name: 'Lith A1',
          tier: 'Lith',
          era: 'Axi',
          vaulted: false,
          rewards: [
            { item: 'Forma Blueprint', rarity: 'Common', chance: 0.25 },
            { item: 'Excalibur Prime Blueprint', rarity: 'Rare', chance: 0.02 },
            { item: 'Orokin Cell', rarity: 'Uncommon', chance: 0.11 },
          ],
        },
        {
          id: 'meso_b2',
          name: 'Meso B2',
          tier: 'Meso',
          era: 'Neo',
          vaulted: false,
          rewards: [
            { item: 'Serration', rarity: 'Common', chance: 0.25 },
            { item: 'Neural Sensor', rarity: 'Uncommon', chance: 0.11 },
            { item: 'Rhino Prime Blueprint', rarity: 'Rare', chance: 0.02 },
          ],
        },
        {
          id: 'neo_c3',
          name: 'Neo C3',
          tier: 'Neo',
          era: 'Axi',
          vaulted: false,
          rewards: [
            { item: 'Boltor Prime Blueprint', rarity: 'Rare', chance: 0.02 },
            { item: 'Forma', rarity: 'Common', chance: 0.25 },
            { item: 'Orokin Cell', rarity: 'Uncommon', chance: 0.11 },
          ],
        },
        {
          id: 'axi_d4',
          name: 'Axi D4',
          tier: 'Axi',
          era: 'Axi',
          vaulted: true,
          rewards: [
            { item: 'Vaulted Item', rarity: 'Rare', chance: 0.02 },
            { item: 'Forma Blueprint', rarity: 'Common', chance: 0.25 },
            { item: 'Neural Sensor', rarity: 'Uncommon', chance: 0.11 },
          ],
        },
      ],
      itemDrops: [
        {
          item: { id: 'forma', name: 'Forma', type: 'Resource', rarity: 'Uncommon', mastery: 0 },
          location: 'Void Fissure',
          chance: 0.25,
        },
        {
          item: { id: 'orokin_cell', name: 'Orokin Cell', type: 'Resource', rarity: 'Uncommon', mastery: 0 },
          location: 'Saturn - Helene',
          chance: 0.15,
        },
        {
          item: { id: 'neural_sensor', name: 'Neural Sensor', type: 'Resource', rarity: 'Rare', mastery: 0 },
          location: 'Jupiter - Io',
          chance: 0.08,
        },
      ],
      relicDrops: [
        {
          relic: { id: 'lith_a1', name: 'Lith A1', tier: 'Lith', era: 'Axi', vaulted: false, rewards: [] },
          location: 'Earth Excavation',
          chance: 0.15,
        },
        {
          relic: { id: 'meso_b2', name: 'Meso B2', tier: 'Meso', era: 'Neo', vaulted: false, rewards: [] },
          location: 'Mars Survival',
          chance: 0.12,
        },
        {
          relic: { id: 'neo_c3', name: 'Neo C3', tier: 'Neo', era: 'Axi', vaulted: false, rewards: [] },
          location: 'Jupiter Defense',
          chance: 0.10,
        },
      ],
    };
  }

  clearCache() {
    this.data = null;
    this.lastLoad = 0;
  }
} 