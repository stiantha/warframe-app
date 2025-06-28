'use client';

import { useState } from 'react';
import { DropTableService } from '../../lib/dropTableService';
import { Item } from '../../models/item';
import { Relic } from '../../models/relic';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';

export default function SearchPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [relics, setRelics] = useState<Relic[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setItems([]);
      setRelics([]);
      return;
    }

    setLoading(true);
    
    try {
      const service = DropTableService.getInstance();
      const [searchItems, searchRelics] = await Promise.all([
        service.searchItems(query),
        service.searchRelics(query),
      ]);
      
      setItems(searchItems);
      setRelics(searchRelics);
    } catch (error) {
      console.error('Search error:', error);
      setItems([]);
      setRelics([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Search Items & Relics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find items, relics, and their drop locations
          </p>
        </div>

        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for items, relics, or locations..."
            className="max-w-2xl"
          />
        </div>

        {searchQuery && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Search results for &quot;{searchQuery}&quot;
            </p>
          </div>
        )}

        <SearchResults
          items={items}
          relics={relics}
          loading={loading}
        />

        {!searchQuery && !loading && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Start searching
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Enter a search term above to find items, relics, and their drop locations.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 