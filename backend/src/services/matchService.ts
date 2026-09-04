import { getSession } from '../config/database.js';
import { MatchResult } from '../types/index.js';

export async function calculateMatch(userId: string, targetUserId: string): Promise<MatchResult> {
  const session = getSession();
  
  try {
    const query = `
      MATCH (u1:User {id: $userId})-[:INTERESTED_IN]->(c:Concept)<-[:INTERESTED_IN]-(u2:User {id: $targetUserId})
      WITH collect(c) AS sharedNodes
      MATCH (u1)-[:INTERESTED_IN]->(c1:Concept)
      WITH sharedNodes, count(c1) AS u1Total
      MATCH (u2:User {id: $targetUserId})-[:INTERESTED_IN]->(c2:Concept)
      WITH sharedNodes, u1Total, count(c2) AS u2Total
      RETURN sharedNodes, u1Total, u2Total
    `;
    
    const result = await session.run(query, { userId, targetUserId });
    
    if (result.records.length === 0) {
      return {
        currentUserId: userId,
        targetUserId,
        sharedNodes: [],
        similarityPercentage: 0,
        breakdown: {}
      };
    }
    
    const record = result.records[0];
    const sharedNodesRaw = record.get('sharedNodes') || [];
    const sharedNodes = sharedNodesRaw.map((node: any) => node.properties);
    
    const u1Total = record.get('u1Total').toNumber();
    const u2Total = record.get('u2Total').toNumber();
    
    const intersectionSize = sharedNodes.length;
    const unionSize = u1Total + u2Total - intersectionSize;
    
    const similarityPercentage = unionSize === 0 ? 0 : (intersectionSize / unionSize) * 100;
    
    // Breakdown by concept type
    const breakdown: Record<string, number> = {};
    for (const node of sharedNodes) {
      const type = node.type || 'Unknown';
      breakdown[type] = (breakdown[type] || 0) + 1;
    }
    
    return {
      currentUserId: userId,
      targetUserId,
      sharedNodes,
      similarityPercentage,
      breakdown
    };
  } finally {
    await session.close();
  }
}
