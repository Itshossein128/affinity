import { Router, Request, Response } from 'express';
import { getSession } from '../config/database.js';

const router = Router();

/**
 * Login by username
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const session = getSession();
  try {
    const { username } = req.body;
    if (!username || typeof username !== 'string' || !username.trim()) {
      res.status(400).json({ error: 'Username is required' });
      return;
    }

    const cleanUsername = username.trim();
    const query = `
      MATCH (u:User)
      WHERE toLower(u.username) = toLower($cleanUsername)
      RETURN u
      LIMIT 1
    `;

    const result = await session.run(query, { cleanUsername });

    if (result.records.length === 0) {
      res.status(404).json({ error: `User with username "${cleanUsername}" not found` });
      return;
    }

    const user = result.records[0].get('u').properties;
    res.json({ user });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await session.close();
  }
});

/**
 * Get all existing users (for account switching / quick select)
 */
router.get('/users', async (req: Request, res: Response): Promise<void> => {
  const session = getSession();
  try {
    const query = `
      MATCH (u:User)
      OPTIONAL MATCH (u)-[r:INTERESTED_IN]->(c:Concept)
      RETURN u, count(DISTINCT c) AS interestCount
      ORDER BY u.displayName ASC
    `;

    const result = await session.run(query);
    const users = result.records.map(record => {
      const u = record.get('u').properties;
      const count = record.get('interestCount');
      return {
        ...u,
        interestCount: typeof count === 'object' && 'toNumber' in count ? count.toNumber() : count
      };
    });

    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await session.close();
  }
});

/**
 * Get user profile by ID
 */
router.get('/me/:id', async (req: Request, res: Response): Promise<void> => {
  const session = getSession();
  try {
    const { id } = req.params;
    const query = `
      MATCH (u:User {id: $id})
      RETURN u
      LIMIT 1
    `;

    const result = await session.run(query, { id });

    if (result.records.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = result.records[0].get('u').properties;
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await session.close();
  }
});

export default router;
