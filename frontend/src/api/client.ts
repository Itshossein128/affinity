import { MatchResult, NeighborhoodResponse, OnboardingPayload } from '../types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    let parsedMessage = errorBody;
    try {
      const json = JSON.parse(errorBody);
      if (json.error) parsedMessage = json.error;
    } catch {
      // Keep errorBody
    }
    throw new Error(parsedMessage || `API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export const apiClient = {
  login: (username: string): Promise<{ user: any }> =>
    fetchJson<{ user: any }>(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username }),
    }),

  listUsers: (): Promise<{ users: any[] }> =>
    fetchJson<{ users: any[] }>(`${API_BASE}/auth/users`),

  getMe: (id: string): Promise<{ user: any }> =>
    fetchJson<{ user: any }>(`${API_BASE}/auth/me/${encodeURIComponent(id)}`),

  fetchNeighborhood: (nodeId: string): Promise<NeighborhoodResponse> =>
    fetchJson<NeighborhoodResponse>(`${API_BASE}/graph/neighborhood?nodeId=${encodeURIComponent(nodeId)}`),

  submitOnboarding: (payload: OnboardingPayload): Promise<{ user: any; neighborhood: NeighborhoodResponse }> =>
    fetchJson<{ user: any; neighborhood: NeighborhoodResponse }>(`${API_BASE}/onboarding`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  importSpotify: (userId: string, artists: any[]): Promise<any> =>
    fetchJson(`${API_BASE}/import/spotify`, {
      method: 'POST',
      body: JSON.stringify({ userId, artists }),
    }),

  fetchMatch: (userId: string, targetUserId: string): Promise<MatchResult> =>
    fetchJson<MatchResult>(`${API_BASE}/match?userId=${encodeURIComponent(userId)}&targetUserId=${encodeURIComponent(targetUserId)}`),
};
