import { Router, Request, Response } from 'express';
import { getNeighborhood } from '../services/graphService.js';

const router = Router();

router.get('/neighborhood', async (req: Request, res: Response): Promise<void> => {
  try {
    const nodeId = req.query.nodeId as string;
    
    if (!nodeId) {
      res.status(400).json({ error: 'Missing required query parameter: nodeId' });
      return;
    }
    
    const result = await getNeighborhood(nodeId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching neighborhood:', error);
    res.status(500).json({ error: 'Internal server error or node not found' });
  }
});

export default router;
