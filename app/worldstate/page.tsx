'use client';

import { useState, useEffect } from 'react';
import { WorldstateService } from '../../lib/worldstateService';
import { WorldstateItem } from '../../models/item';
import WorldstateDisplay from '../components/WorldstateDisplay';

export default function WorldstatePage() {
  const [worldstateData, setWorldstateData] = useState<{
    alerts: WorldstateItem[];
    invasions: WorldstateItem[];
    sorties: WorldstateItem[];
    fissures: WorldstateItem[];
    events: WorldstateItem[];
    nightwave: WorldstateItem[];
  }>({
    alerts: [],
    invasions: [],
    sorties: [],
    fissures: [],
    events: [],
    nightwave: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorldstate = async () => {
      try {
        setLoading(true);
        const service = WorldstateService.getInstance();
        const data = await service.fetchWorldstate();
        setWorldstateData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load worldstate data');
        console.error('Error fetching worldstate:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorldstate();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchWorldstate, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <p className="text-red-500 dark:text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Warframe Worldstate
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Current alerts, invasions, sorties, and more
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <WorldstateDisplay
            title="Alerts"
            items={worldstateData.alerts}
            type="Alerts"
          />
          <WorldstateDisplay
            title="Invasions"
            items={worldstateData.invasions}
            type="Invasions"
          />
          <WorldstateDisplay
            title="Sorties"
            items={worldstateData.sorties}
            type="Sorties"
          />
          <WorldstateDisplay
            title="Void Fissures"
            items={worldstateData.fissures}
            type="Fissures"
          />
          <WorldstateDisplay
            title="Events"
            items={worldstateData.events}
            type="Events"
          />
          <WorldstateDisplay
            title="Nightwave"
            items={worldstateData.nightwave}
            type="Nightwave"
          />
        </div>
      </div>
    </div>
  );
} 