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
  Time?: number;
  Alerts?: RawAlert[];
  Invasions?: RawInvasion[];
  Sorties?: RawSortie[];
  VoidTraders?: RawVoidTrader[];
  Events?: RawEvent[];
  Nightwave?: RawNightwave;
}

interface RawAlert {
  _id?: {
    $oid?: string;
  };
  Activation?: {
    $date?: {
      $numberLong?: string;
    };
  };
  Expiry?: {
    $date?: {
      $numberLong?: string;
    };
  };
  MissionInfo?: {
    locationTag?: string;
    missionType?: string;
    faction?: string;
    rewardTypes?: string[];
    levelOverride?: string;
    enemySpec?: string;
    minEnemyLevel?: number;
    maxEnemyLevel?: number;
    maxWaveNum?: number;
    description?: string;
  };
  MissionReward?: {
    countedItems?: Array<{
      ItemType?: string;
      ItemCount?: number;
    }>;
    thumbnail?: string;
    color?: number;
    credits?: number;
    asString?: string;
    items?: string[];
    itemString?: string;
  };
}

interface RawInvasion {
  _id?: {
    $oid?: string;
  };
  Activation?: {
    $date?: {
      $numberLong?: string;
    };
  };
  Expiry?: {
    $date?: {
      $numberLong?: string;
    };
  };
  AttackerMissionInfo?: {
    locationTag?: string;
    missionType?: string;
    faction?: string;
  };
  DefenderMissionInfo?: {
    locationTag?: string;
    missionType?: string;
    faction?: string;
  };
  AttackerReward?: {
    countedItems?: Array<{
      ItemType?: string;
      ItemCount?: number;
    }>;
    asString?: string;
  };
  DefenderReward?: {
    countedItems?: Array<{
      ItemType?: string;
      ItemCount?: number;
    }>;
    asString?: string;
  };
  Count?: number;
  Goal?: number;
  Completed?: boolean;
}

interface RawSortie {
  _id?: {
    $oid?: string;
  };
  Activation?: {
    $date?: {
      $numberLong?: string;
    };
  };
  Expiry?: {
    $date?: {
      $numberLong?: string;
    };
  };
  Variants?: Array<{
    boss?: string;
    planet?: string;
    missionType?: string;
    modifier?: string;
    modifierDescription?: string;
    node?: string;
  }>;
  Boss?: string;
  Faction?: string;
  RewardPool?: string;
}

interface RawVoidTrader {
  _id?: {
    $oid?: string;
  };
  Activation?: {
    $date?: {
      $numberLong?: string;
    };
  };
  Expiry?: {
    $date?: {
      $numberLong?: string;
    };
  };
  Character?: string;
  Location?: string;
  Inventory?: Array<{
    item?: string;
    ducats?: number;
    credits?: number;
  }>;
}

interface RawEvent {
  _id?: {
    $oid?: string;
  };
  Messages?: Array<{
    LanguageCode?: string;
    Message?: string;
  }>;
  Prop?: string;
  Date?: {
    $date?: {
      $numberLong?: string;
    };
  };
  EventEndDate?: {
    $date?: {
      $numberLong?: string;
    };
  };
  Priority?: boolean;
  MobileOnly?: boolean;
  Community?: boolean;
}

interface RawNightwave {
  _id?: {
    $oid?: string;
  };
  Activation?: {
    $date?: {
      $numberLong?: string;
    };
  };
  Expiry?: {
    $date?: {
      $numberLong?: string;
    };
  };
  Season?: number;
  Phase?: number;
  ActiveChallenges?: Array<{
    _id?: string;
    Activation?: {
      $date?: {
        $numberLong?: string;
      };
    };
    Expiry?: {
      $date?: {
        $numberLong?: string;
      };
    };
    Challenge?: string;
    Daily?: boolean;
    Elite?: boolean;
    Desc?: string;
    Title?: string;
    Reputation?: number;
  }>;
}

export function parseWorldstateData(data: RawWorldstateData): WorldstateData {
  const timestamp = data.Time ? new Date(data.Time * 1000).toISOString() : new Date().toISOString();
  
  return {
    timestamp,
    alerts: parseAlerts(data.Alerts || []),
    invasions: parseInvasions(data.Invasions || []),
    sorties: parseSorties(data.Sorties || []),
    fissures: parseFissures(data.VoidTraders || []), // Using VoidTraders as fissures for now
    events: parseEvents(data.Events || []),
    nightwave: parseNightwave(data.Nightwave),
  };
}

function parseAlerts(alerts: RawAlert[]): WorldstateItem[] {
  return alerts.map(alert => ({
    id: alert._id?.$oid || 'unknown',
    name: alert.MissionInfo?.missionType || 'Alert',
    type: 'Alert',
    location: alert.MissionInfo?.locationTag || 'Unknown',
    startTime: alert.Activation?.$date?.$numberLong ? new Date(parseInt(alert.Activation.$date.$numberLong)).toISOString() : undefined,
    endTime: alert.Expiry?.$date?.$numberLong ? new Date(parseInt(alert.Expiry.$date.$numberLong)).toISOString() : undefined,
    description: alert.MissionReward?.asString || alert.MissionInfo?.description || '',
  }));
}

function parseInvasions(invasions: RawInvasion[]): WorldstateItem[] {
  return invasions.map(invasion => ({
    id: invasion._id?.$oid || 'unknown',
    name: `${invasion.AttackerMissionInfo?.faction || 'Unknown'} vs ${invasion.DefenderMissionInfo?.faction || 'Unknown'}`,
    type: 'Invasion',
    location: invasion.AttackerMissionInfo?.locationTag || 'Unknown',
    startTime: invasion.Activation?.$date?.$numberLong ? new Date(parseInt(invasion.Activation.$date.$numberLong)).toISOString() : undefined,
    endTime: invasion.Expiry?.$date?.$numberLong ? new Date(parseInt(invasion.Expiry.$date.$numberLong)).toISOString() : undefined,
    description: `${invasion.AttackerReward?.asString || 'Unknown'} vs ${invasion.DefenderReward?.asString || 'Unknown'} (${invasion.Count || 0}/${invasion.Goal || 0})`,
  }));
}

function parseSorties(sorties: RawSortie[]): WorldstateItem[] {
  return sorties.map(sortie => ({
    id: sortie._id?.$oid || 'unknown',
    name: `Sortie: ${sortie.Boss || 'Unknown Boss'}`,
    type: 'Sortie',
    location: sortie.Variants?.[0]?.planet || 'Unknown',
    startTime: sortie.Activation?.$date?.$numberLong ? new Date(parseInt(sortie.Activation.$date.$numberLong)).toISOString() : undefined,
    endTime: sortie.Expiry?.$date?.$numberLong ? new Date(parseInt(sortie.Expiry.$date.$numberLong)).toISOString() : undefined,
    description: sortie.Variants?.map(v => `${v.missionType} - ${v.modifier}`).join(', ') || '',
  }));
}

function parseFissures(voidTraders: RawVoidTrader[]): WorldstateItem[] {
  // Note: The official API doesn't seem to have fissures in the same format
  // This is a placeholder - we might need to use a different endpoint for fissures
  return voidTraders.map(trader => ({
    id: trader._id?.$oid || 'unknown',
    name: `Void Trader: ${trader.Character || 'Baro Ki'Teer'}`,
    type: 'Fissure',
    location: trader.Location || 'Unknown',
    startTime: trader.Activation?.$date?.$numberLong ? new Date(parseInt(trader.Activation.$date.$numberLong)).toISOString() : undefined,
    endTime: trader.Expiry?.$date?.$numberLong ? new Date(parseInt(trader.Expiry.$date.$numberLong)).toISOString() : undefined,
    description: `Available at ${trader.Location}`,
  }));
}

function parseEvents(events: RawEvent[]): WorldstateItem[] {
  return events.map(event => ({
    id: event._id?.$oid || 'unknown',
    name: event.Messages?.[0]?.Message || 'Event',
    type: 'Event',
    location: 'Global',
    startTime: event.Date?.$date?.$numberLong ? new Date(parseInt(event.Date.$date.$numberLong)).toISOString() : undefined,
    endTime: event.EventEndDate?.$date?.$numberLong ? new Date(parseInt(event.EventEndDate.$date.$numberLong)).toISOString() : undefined,
    description: event.Prop || '',
  }));
}

function parseNightwave(nightwave?: RawNightwave): WorldstateItem[] {
  if (!nightwave) return [];
  
  return [{
    id: nightwave._id?.$oid || 'unknown',
    name: `Nightwave Season ${nightwave.Season || 'Unknown'}`,
    type: 'Nightwave',
    location: 'Global',
    startTime: nightwave.Activation?.$date?.$numberLong ? new Date(parseInt(nightwave.Activation.$date.$numberLong)).toISOString() : undefined,
    endTime: nightwave.Expiry?.$date?.$numberLong ? new Date(parseInt(nightwave.Expiry.$date.$numberLong)).toISOString() : undefined,
    description: `Phase ${nightwave.Phase || 1} - ${nightwave.ActiveChallenges?.length || 0} active challenges`,
  }];
} 