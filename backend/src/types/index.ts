export interface ConceptNode {
  id: string;                    // internal UUID
  canonicalId: string;           // e.g. "wd:Q12345" (Wikidata) or "mb:xxx" (MusicBrainz)
  name: string;
  type: 'Genre' | 'Artist' | 'Movie' | 'Book' | 'Game' | 'Category' | 'Person';
  description?: string;
  imageUrl?: string;
  properties?: Record<string, unknown>;
}

export interface UserNode {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface InterestEdge {
  userId: string;
  conceptId: string;
  weight: number;        // 0.0 - 1.0
  addedAt: string;       // ISO timestamp
  note?: string;         // personal annotation
}

export interface ConceptRelation {
  sourceId: string;
  targetId: string;
  relationType: 'SUB_CLASS_OF' | 'RELATED_TO';
}

export interface NeighborhoodResponse {
  focusNode: ConceptNode | UserNode;
  neighbors: Array<{
    node: ConceptNode | UserNode;
    edge: {
      type: string;
      direction: 'incoming' | 'outgoing';
      properties: Record<string, unknown>;
    };
  }>;
}

export interface MatchResult {
  currentUserId: string;
  targetUserId: string;
  sharedNodes: ConceptNode[];
  similarityPercentage: number;
  breakdown: Record<string, number>;  // per-category similarity
}

export interface OnboardingPayload {
  username: string;
  displayName: string;
  selectedConceptIds: string[];  // canonicalIds from seed DB
  weights?: Record<string, number>;  // optional per-concept weights
}

export interface SpotifyArtistPayload {
  artists: Array<{
    name: string;
    spotifyId: string;
    genres: string[];
    popularity: number;
  }>;
}
