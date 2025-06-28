import { NextApiRequest, NextApiResponse } from 'next';
import { WorldstateService } from '../../lib/worldstateService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const service = WorldstateService.getInstance();
    const worldstateData = await service.fetchWorldstate();
    
    res.status(200).json(worldstateData);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch worldstate data' });
  }
} 