import { NextApiRequest, NextApiResponse } from 'next';
import { DropTableService } from '../../lib/dropTableService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q: query } = req.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const service = DropTableService.getInstance();
    const [items, relics] = await Promise.all([
      service.searchItems(query),
      service.searchRelics(query),
    ]);
    
    res.status(200).json({
      items,
      relics,
      query,
    });
  } catch (error) {
    console.error('Search API Error:', error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
} 