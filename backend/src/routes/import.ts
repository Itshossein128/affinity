import { Router, Request, Response } from 'express';
import { importSpotifyArtists } from '../services/importService.js';
import { SpotifyArtistPayload } from '../types/index.js';

const router = Router();

router.post('/spotify', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, artists } = req.body as { userId: string, artists: any[] };
    
    if (!userId || !artists || !Array.isArray(artists)) {
      res.status(400).json({ error: 'Missing or invalid fields (userId, artists array)' });
      return;
    }
    
    const payload: SpotifyArtistPayload = { artists };
    const result = await importSpotifyArtists(userId, payload);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error importing spotify artists:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
