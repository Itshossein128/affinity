export type NodeType = 'Genre' | 'Artist' | 'Movie' | 'Book' | 'Game' | 'Category' | 'Person' | 'User';

export interface UserNode {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  createdAt?: string;
  interestCount?: number;
}

export interface BaseNode {
  id: string;
  type: NodeType;
  name: string;
  canonicalId?: string;
  description?: string;
  avatarUrl?: string;
  username?: string;
  displayName?: string;
}

export interface Edge {
  type: string;
  direction: 'incoming' | 'outgoing';
  properties: Record<string, unknown>;
}

export interface NeighborEntry {
  node: BaseNode;
  edge: Edge;
}

export interface NeighborhoodResponse {
  focusNode: BaseNode;
  neighbors: NeighborEntry[];
}

export interface MatchResult {
  currentUserId: string;
  targetUserId: string;
  sharedNodes: BaseNode[];
  similarityPercentage: number;
  breakdown: Record<string, number>;
}

export interface OnboardingPayload {
  username: string;
  displayName: string;
  selectedConceptIds: string[];  // canonicalIds
  weights?: Record<string, number>;
}
