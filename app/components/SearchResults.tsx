'use client';

import { Item } from '../../models/item';
import { Relic } from '../../models/relic';
import { getRarityColor, getTierColor, formatChance } from '../../lib/helpers';

interface SearchResultsProps {
  items: Item[];
  relics: Relic[];
  loading: boolean;
}

export default function SearchResults({ items, relics, loading }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const hasResults = items.length > 0 || relics.length > 0;

  if (!hasResults) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No results found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Items Section */}
      {items.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Items ({items.length})</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getRarityColor(item.rarity)}`}>
                    {item.rarity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.type}</p>
                {item.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                )}
                {item.mastery > 0 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    Mastery Rank {item.mastery}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Relics Section */}
      {relics.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Relics ({relics.length})</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relics.map((relic) => (
              <div
                key={relic.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{relic.name}</h4>
                  <div className="flex flex-col items-end">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTierColor(relic.tier)}`}>
                      {relic.tier}
                    </span>
                    {relic.vaulted && (
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 mt-1">
                        Vaulted
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{relic.era}</p>
                
                {relic.rewards.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rewards:</h5>
                    <div className="space-y-1">
                      {relic.rewards.slice(0, 3).map((reward, index) => (
                        <div key={index} className="flex justify-between items-center text-xs">
                          <span className="text-gray-600 dark:text-gray-400">{reward.item}</span>
                          <div className="flex items-center space-x-2">
                            <span className={`px-1 py-0.5 rounded text-xs ${getRarityColor(reward.rarity)}`}>
                              {reward.rarity}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {formatChance(reward.chance)}
                            </span>
                          </div>
                        </div>
                      ))}
                      {relic.rewards.length > 3 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          +{relic.rewards.length - 3} more rewards
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 