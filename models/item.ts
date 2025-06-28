export interface Item {
  id: string;
  name: string;
  type: 'Warframe' | 'Weapon' | 'Mod' | 'Resource' | 'Prime' | 'Arcane' | 'Other';
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  mastery: number;
  description?: string;
  image?: string;
}

export interface ItemDrop {
  item: Item;
  location: string;
  rotation?: string;
  chance: number;
  quantity?: number;
}

export interface WorldstateItem {
  id: string;
  name: string;
  type: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  description?: string;
} 