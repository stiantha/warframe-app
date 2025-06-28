export interface Relic {
  id: string;
  name: string;
  tier: 'Lith' | 'Meso' | 'Neo' | 'Axi';
  era: string;
  vaulted: boolean;
  rewards: RelicReward[];
}

export interface RelicReward {
  item: string;
  rarity: 'Common' | 'Uncommon' | 'Rare';
  chance: number;
}

export interface RelicDrop {
  relic: Relic;
  location: string;
  rotation?: string;
  chance: number;
} 