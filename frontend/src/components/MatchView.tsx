import { useEffect, useState } from 'react';
import { MatchResult } from '../types';
import { apiClient } from '../api/client';

export default function MatchView({ currentUserId, targetUserId }: { currentUserId: string; targetUserId: string }) {
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    apiClient.fetchMatch(currentUserId, targetUserId)
      .then(setMatch)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [currentUserId, targetUserId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Calculating affinity...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-6 max-w-md text-center">
          <p className="font-semibold mb-2">Could not calculate match</p>
          <p className="text-sm text-red-400/70">{error}</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/40">
        <p>Enter two valid user IDs to compare</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
      <div className="max-w-3xl w-full bg-surface/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
        {/* Avatars and score */}
        <div className="flex items-center justify-between mb-12">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary mx-auto mb-3 flex items-center justify-center text-3xl">
              👤
            </div>
            <div className="font-bold">You</div>
          </div>

          <div className="text-center px-8 relative">
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <div className="w-32 h-32 rounded-full bg-accent/20 blur-xl animate-pulse"></div>
            </div>
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-secondary to-accent">
              {Math.round(match.similarityPercentage)}%
            </div>
            <div className="text-sm text-white/50 uppercase tracking-widest mt-2 font-semibold">Affinity Score</div>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-secondary/20 border-2 border-secondary mx-auto mb-3 flex items-center justify-center text-3xl">
              👤
            </div>
            <div className="font-bold">Target</div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Shared interests */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">
              Shared Interests ({match.sharedNodes.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {match.sharedNodes.map(node => (
                <span
                  key={node.id || node.canonicalId}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition-colors"
                >
                  {node.name} <span className="text-white/30 text-xs ml-1">{node.type}</span>
                </span>
              ))}
              {match.sharedNodes.length === 0 && (
                <p className="text-white/40 text-sm">No shared interests found</p>
              )}
            </div>
          </div>

          {/* Breakdown */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Category Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(match.breakdown).map(([category, count]) => {
                const total = match.sharedNodes.length || 1;
                const ratio = count / total;
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">{category}</span>
                      <span className="font-mono">{count} shared</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(ratio * 100, 5)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {Object.keys(match.breakdown).length === 0 && (
                <p className="text-white/40 text-sm">No category data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
