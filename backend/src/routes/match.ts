import { Router, Request, Response } from 'express';
import { calculateMatch } from '../services/matchService.js';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.userId as string;
    const targetUserId = req.query.targetUserId as string;
    
    if (!userId || !targetUserId) {
      res.status(400).json({ error: 'Missing required query parameters: userId, targetUserId' });
      return;
    }
    
    const result = await calculateMatch(userId, targetUserId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error calculating match:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
