'use client';

import { useEffect } from 'react';
import { WorldstateItem } from '../../models/item';
import { getTimeRemaining, getRarityColor } from '../../lib/helpers';

interface WorldstateDisplayProps {
  title: string;
  items: WorldstateItem[];
  type: string;
}

export default function WorldstateDisplay({ title, items, type }: WorldstateDisplayProps) {
  useEffect(() => {
    const timer = setInterval(() => {
      // Force re-render to update time remaining
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
        <p className="text-gray-500 dark:text-gray-400">No {type.toLowerCase()} available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.location}</p>
                {item.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                )}
              </div>
              <div className="text-right">
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getRarityColor(item.type)}`}>
                  {item.type}
                </span>
                {item.endTime && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {getTimeRemaining(item.endTime)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 