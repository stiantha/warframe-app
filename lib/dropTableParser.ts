import { Item, ItemDrop } from '../models/item';
import { Relic, RelicDrop } from '../models/relic';

export interface DropTableData {
  items: Item[];
  relics: Relic[];
  itemDrops: ItemDrop[];
  relicDrops: RelicDrop[];
}

interface RawItem {
  id?: string;
  name?: string;
  type?: string;
  rarity?: string;
  mastery?: number;
  description?: string;
  image?: string;
}

interface RawRelic {
  id?: string;
  name?: string;
  tier?: string;
  era?: string;
  vaulted?: boolean;
  rewards?: RawRelicReward[];
}

interface RawRelicReward {
  item?: string;
  rarity?: string;
  chance?: number;
}

interface RawItemDrop {
  item?: RawItem;
  location?: string;
  rotation?: string;
  chance?: number;
  quantity?: number;
}

interface RawRelicDrop {
  relic?: RawRelic;
  location?: string;
  rotation?: string;
  chance?: number;
}

export function parseDropTableData(data: {
  items?: RawItem[];
  relics?: RawRelic[];
  itemDrops?: RawItemDrop[];
  relicDrops?: RawRelicDrop[];
}): DropTableData {
  return {
    items: parseItems(data.items || []),
    relics: parseRelics(data.relics || []),
    itemDrops: parseItemDrops(data.itemDrops || []),
    relicDrops: parseRelicDrops(data.relicDrops || []),
  };
}

function parseItems(items: RawItem[]): Item[] {
  return items.map(item => ({
    id: item.id || item.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown',
    name: item.name || 'Unknown Item',
    type: (item.type as Item['type']) || 'Other',
    rarity: (item.rarity as Item['rarity']) || 'Common',
    mastery: item.mastery || 0,
    description: item.description || '',
    image: item.image || '',
  }));
}

function parseRelics(relics: RawRelic[]): Relic[] {
  return relics.map(relic => ({
    id: relic.id || relic.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown',
    name: relic.name || 'Unknown Relic',
    tier: (relic.tier as Relic['tier']) || 'Lith',
    era: relic.era || 'Unknown',
    vaulted: relic.vaulted || false,
    rewards: parseRelicRewards(relic.rewards || []),
  }));
}

function parseRelicRewards(rewards: RawRelicReward[]): Relic['rewards'] {
  return rewards.map(reward => ({
    item: reward.item || 'Unknown',
    rarity: (reward.rarity as Relic['rewards'][0]['rarity']) || 'Common',
    chance: reward.chance || 0,
  }));
}

function parseItemDrops(drops: RawItemDrop[]): ItemDrop[] {
  return drops.map(drop => ({
    item: parseItems([drop.item || {}])[0],
    location: drop.location || 'Unknown',
    rotation: drop.rotation,
    chance: drop.chance || 0,
    quantity: drop.quantity || 1,
  }));
}

function parseRelicDrops(drops: RawRelicDrop[]): RelicDrop[] {
  return drops.map(drop => ({
    relic: parseRelics([drop.relic || {}])[0],
    location: drop.location || 'Unknown',
    rotation: drop.rotation,
    chance: drop.chance || 0,
  }));
}

export function searchItems(items: Item[], query: string): Item[] {
  const searchTerm = query.toLowerCase();
  return items.filter(item => 
    item.name.toLowerCase().includes(searchTerm) ||
    item.type.toLowerCase().includes(searchTerm) ||
    (item.description && item.description.toLowerCase().includes(searchTerm))
  );
}

export function searchRelics(relics: Relic[], query: string): Relic[] {
  const searchTerm = query.toLowerCase();
  return relics.filter(relic => 
    relic.name.toLowerCase().includes(searchTerm) ||
    relic.tier.toLowerCase().includes(searchTerm) ||
    relic.era.toLowerCase().includes(searchTerm) ||
    relic.rewards.some(reward => 
      reward.item.toLowerCase().includes(searchTerm)
    )
  );
} 