import { v4 as uuidv4 } from 'uuid';
import { getSession } from '../config/database.js';
import { OnboardingPayload } from '../types/index.js';
import { getNeighborhood } from './graphService.js';

export async function createUserWithInterests(payload: OnboardingPayload) {
  const session = getSession();
  const userId = uuidv4();
  
  try {
    const tx = session.beginTransaction();
    
    // Create user
    await tx.run(
      'CREATE (u:User {id: $id, username: $username, displayName: $displayName, createdAt: $createdAt})',
      {
        id: userId,
        username: payload.username,
        displayName: payload.displayName,
        createdAt: new Date().toISOString()
      }
    );

    // Create interests
    for (const conceptId of payload.selectedConceptIds) {
      const weight = payload.weights?.[conceptId] || 1.0;
      await tx.run(
        `MATCH (u:User {id: $userId})
         MATCH (c:Concept {canonicalId: $conceptId})
         MERGE (u)-[r:INTERESTED_IN]->(c)
         SET r.weight = $weight, r.addedAt = $addedAt`,
        {
          userId,
          conceptId,
          weight,
          addedAt: new Date().toISOString()
        }
      );
    }

    // Automatically connect user to parent Genres and Categories
    await tx.run(
      `MATCH (u:User {id: $userId})-[:INTERESTED_IN]->(c:Concept)
       MATCH (c)-[:RELATED_TO|SUB_CLASS_OF*1..2]->(parent:Concept)
       WHERE parent.type IN ['Genre', 'Category']
       MERGE (u)-[r:INTERESTED_IN]->(parent)
       ON CREATE SET r.weight = 0.8, r.addedAt = $addedAt`,
      {
        userId,
        addedAt: new Date().toISOString()
      }
    );
    
    await tx.commit();
    
    // Return user and neighborhood
    const neighborhood = await getNeighborhood(userId);
    return { user: neighborhood.focusNode, neighborhood };
  } catch (error) {
    throw error;
  } finally {
    await session.close();
  }
}
