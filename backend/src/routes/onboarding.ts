import { Router, Request, Response } from 'express';
import { createUserWithInterests } from '../services/onboardingService.js';
import { OnboardingPayload } from '../types/index.js';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const payload: OnboardingPayload = req.body;
    
    if (!payload.username || !payload.displayName || !payload.selectedConceptIds || !Array.isArray(payload.selectedConceptIds)) {
      res.status(400).json({ error: 'Missing or invalid required fields (username, displayName, selectedConceptIds array)' });
      return;
    }
    
    const result = await createUserWithInterests(payload);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error in onboarding:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
