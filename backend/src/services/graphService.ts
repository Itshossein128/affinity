import { getSession } from '../config/database.js';
import { ConceptNode, UserNode } from '../types/index.js';

export async function getNeighborhood(nodeId: string) {
  const session = getSession();
  try {
    // If the focus node is a User, return top-level Categories (or fallback to all interests)
    // For Concept nodes, return all parent, child, and related relationships
    const query = `
      MATCH (n {id: $nodeId})
      WITH n, labels(n) AS lbls
      OPTIONAL MATCH (n:User)-[rCat:INTERESTED_IN]->(cat:Concept {type: 'Category'})
      WITH n, lbls, collect(DISTINCT {
        node: cat,
        relType: type(rCat),
        direction: 'outgoing',
        properties: properties(rCat)
      }) AS catNeighbors
      OPTIONAL MATCH (n)-[r]-(m)
      WITH n, lbls, catNeighbors, collect(DISTINCT {
        node: m,
        relType: type(r),
        direction: CASE WHEN startNode(r) = n THEN 'outgoing' ELSE 'incoming' END,
        properties: properties(r)
      }) AS allNeighbors
      RETURN n,
        CASE
          WHEN 'User' IN lbls AND size([x IN catNeighbors WHERE x.node IS NOT NULL]) > 0
          THEN [x IN catNeighbors WHERE x.node IS NOT NULL]
          ELSE [x IN allNeighbors WHERE x.node IS NOT NULL]
        END AS neighbors
    `;

    const result = await session.run(query, { nodeId });

    if (result.records.length === 0) {
      throw new Error(`Node not found: ${nodeId}`);
    }

    const record = result.records[0];
    const focusNodeRaw = record.get('n');
    const neighborsRaw = record.get('neighbors') || [];

    // Determine focus node type from labels
    const focusLabels = focusNodeRaw.labels || [];
    const focusProps = focusNodeRaw.properties;
    const focusNode = {
      ...toPlain(focusProps),
      type: focusLabels.includes('User') ? 'User' : (focusProps.type || 'Concept'),
    };

    // Process neighbors, filtering out null entries
    const neighbors = neighborsRaw
      .filter((n: any) => n.node !== null)
      .map((n: any) => {
        const neighborLabels = n.node.labels || [];
        const neighborProps = n.node.properties;
        return {
          node: {
            ...toPlain(neighborProps),
            type: neighborLabels.includes('User') ? 'User' : (neighborProps.type || 'Concept'),
          },
          edge: {
            type: n.relType,
            direction: n.direction,
            properties: toPlain(n.properties || {}),
          },
        };
      });

    // Deduplicate neighbors by node id (in case of multiple relationships)
    const seen = new Set<string>();
    const uniqueNeighbors = neighbors.filter((n: any) => {
      if (seen.has(n.node.id)) return false;
      seen.add(n.node.id);
      return true;
    });

    return { focusNode, neighbors: uniqueNeighbors };
  } finally {
    await session.close();
  }
}

export async function getNodeById(nodeId: string): Promise<ConceptNode | UserNode | null> {
  const session = getSession();
  try {
    const query = `MATCH (n {id: $nodeId}) RETURN n`;
    const result = await session.run(query, { nodeId });

    if (result.records.length === 0) {
      return null;
    }

    return toPlain(result.records[0].get('n').properties) as ConceptNode | UserNode;
  } finally {
    await session.close();
  }
}

/**
 * Convert Neo4j Integer types to plain JS numbers
 */
function toPlain(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object' && 'toNumber' in value) {
      result[key] = value.toNumber();
    } else {
      result[key] = value;
    }
  }
  return result;
}
