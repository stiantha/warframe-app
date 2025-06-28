import { WorldstateItem } from '../models/item';

export interface WorldstateData {
  timestamp: string;
  alerts: WorldstateItem[];
  invasions: WorldstateItem[];
  sorties: WorldstateItem[];
  fissures: WorldstateItem[];
  events: WorldstateItem[];
  nightwave: WorldstateItem[];
}

interface RawWorldstateData {
  timestamp?: string;
  alerts?: RawAlert[];
  invasions?: RawInvasion[];
  sorties?: RawSortie[];
  fissures?: RawFissure[];
  events?: RawEvent[];
  nightwave?: RawNightwave[];
}

interface RawAlert {
  id?: string;
  guid?: string;
  activation?: string;
  expiry?: string;
  mission?: {
    type?: string;
    node?: string;
    description?: string;
  };
}

interface RawInvasion {
  id?: string;
  guid?: string;
  activation?: string;
  expiry?: string;
  node?: string;
  attackerReward?: {
    asString?: string;
  };
  defenderReward?: {
    asString?: string;
  };
}

interface RawSortie {
  id?: string;
  guid?: string;
  activation?: string;
  expiry?: string;
  variants?: Array<{
    missionType?: string;
    node?: string;
  }>;
}

interface RawFissure {
  id?: string;
  guid?: string;
  activation?: string;
  expiry?: string;
  node?: string;
  tier?: string;
  missionType?: string;
  enemy?: string;
}

interface RawEvent {
  id?: string;
  guid?: string;
  activation?: string;
  expiry?: string;
  node?: string;
  description?: string;
}

interface RawNightwave {
  id?: string;
  guid?: string;
  activation?: string;
  expiry?: string;
  title?: string;
  description?: string;
}

export function parseWorldstateData(data: RawWorldstateData): WorldstateData {
  return {
    timestamp: data.timestamp || new Date().toISOString(),
    alerts: parseAlerts(data.alerts || []),
    invasions: parseInvasions(data.invasions || []),
    sorties: parseSorties(data.sorties || []),
    fissures: parseFissures(data.fissures || []),
    events: parseEvents(data.events || []),
    nightwave: parseNightwave(data.nightwave || []),
  };
}

function parseAlerts(alerts: RawAlert[]): WorldstateItem[] {
  return alerts.map(alert => ({
    id: alert.id || alert.guid || 'unknown',
    name: alert.mission?.type || 'Alert',
    type: 'Alert',
    location: alert.mission?.node || 'Unknown',
    startTime: alert.activation,
    endTime: alert.expiry,
    description: alert.mission?.description || '',
  }));
}

function parseInvasions(invasions: RawInvasion[]): WorldstateItem[] {
  return invasions.map(invasion => ({
    id: invasion.id || invasion.guid || 'unknown',
    name: invasion.node || 'Invasion',
    type: 'Invasion',
    location: invasion.node || 'Unknown',
    startTime: invasion.activation,
    endTime: invasion.expiry,
    description: `${invasion.attackerReward?.asString || 'Unknown'} vs ${invasion.defenderReward?.asString || 'Unknown'}`,
  }));
}

function parseSorties(sorties: RawSortie[]): WorldstateItem[] {
  return sorties.map(sortie => ({
    id: sortie.id || sortie.guid || 'unknown',
    name: `Sortie ${sortie.variants?.[0]?.missionType || 'Mission'}`,
    type: 'Sortie',
    location: sortie.variants?.[0]?.node || 'Unknown',
    startTime: sortie.activation,
    endTime: sortie.expiry,
    description: sortie.variants?.map((v) => v.missionType).join(', ') || '',
  }));
}

function parseFissures(fissures: RawFissure[]): WorldstateItem[] {
  return fissures.map(fissure => ({
    id: fissure.id || fissure.guid || 'unknown',
    name: `${fissure.tier} Fissure`,
    type: 'Fissure',
    location: fissure.node || 'Unknown',
    startTime: fissure.activation,
    endTime: fissure.expiry,
    description: `${fissure.missionType} - ${fissure.enemy} (${fissure.tier})`,
  }));
}

function parseEvents(events: RawEvent[]): WorldstateItem[] {
  return events.map(event => ({
    id: event.id || event.guid || 'unknown',
    name: event.description || 'Event',
    type: 'Event',
    location: event.node || 'Global',
    startTime: event.activation,
    endTime: event.expiry,
    description: event.description || '',
  }));
}

function parseNightwave(nightwave: RawNightwave[]): WorldstateItem[] {
  return nightwave.map(nw => ({
    id: nw.id || nw.guid || 'unknown',
    name: nw.title || 'Nightwave',
    type: 'Nightwave',
    location: 'Global',
    startTime: nw.activation,
    endTime: nw.expiry,
    description: nw.description || '',
  }));
} 