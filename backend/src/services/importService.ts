import { getSession } from '../config/database.js';
import { SpotifyArtistPayload } from '../types/index.js';

export async function importSpotifyArtists(userId: string, payload: SpotifyArtistPayload) {
  const session = getSession();
  const matched = [];
  const unmatched = [];

  try {
    const tx = session.beginTransaction();

    for (const artist of payload.artists) {
      const result = await tx.run(
        `MATCH (c:Concept {type: 'Artist'})
         WHERE toLower(c.name) CONTAINS toLower($name)
         RETURN c`,
        { name: artist.name }
      );

      if (result.records.length > 0) {
        const concept = result.records[0].get('c').properties;
        await tx.run(
          `MATCH (u:User {id: $userId})
           MATCH (c:Concept {id: $conceptId})
           MERGE (u)-[r:INTERESTED_IN]->(c)
           ON CREATE SET r.weight = 0.8, r.addedAt = $addedAt`,
          { userId, conceptId: concept.id, addedAt: new Date().toISOString() }
        );
        matched.push({ original: artist.name, matchedTo: concept.name });
      } else {
        unmatched.push(artist.name);
      }
    }

    await tx.commit();

    return {
      totalProcessed: payload.artists.length,
      matchedCount: matched.length,
      unmatchedCount: unmatched.length,
      matched,
      unmatched
    };
  } finally {
    await session.close();
  }
}
