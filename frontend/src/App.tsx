import { useState } from 'react';
import Header from './components/Header';
import GraphCanvas from './components/GraphCanvas';
import NodeDetail from './components/NodeDetail';
import OnboardingFlow from './components/OnboardingFlow';
import MatchView from './components/MatchView';
import { useGraph } from './hooks/useGraph';
import { BaseNode } from './types';

type ViewState = 'onboarding' | 'graph' | 'match';

export default function App() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>('onboarding');
  const [detailNode, setDetailNode] = useState<BaseNode | null>(null);

  // For the match demo, we store a target user ID
  const [targetUserId, setTargetUserId] = useState<string>('');

  const {
    neighborhood,
    loading,
    navigateTo,
    goBack,
    canGoBack
  } = useGraph(currentUserId);

  const handleOnboardingComplete = (userId: string) => {
    setCurrentUserId(userId);
    setView('graph');
  };

  const handleNodeClick = (nodeId: string) => {
    navigateTo(nodeId);
    setDetailNode(null);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background text-white">
      <Header
        currentView={view}
        setView={setView}
        canGoBack={canGoBack}
        onGoBack={goBack}
      />

      <main className="flex-1 relative flex overflow-hidden">
        {view === 'onboarding' && (
          <div className="w-full flex items-center justify-center overflow-y-auto">
            <OnboardingFlow onComplete={handleOnboardingComplete} />
          </div>
        )}

        {view === 'graph' && (
          <>
            <div className="flex-1 relative">
              {!currentUserId ? (
                <div className="flex items-center justify-center h-full text-white/40">
                  <div className="text-center">
                    <p className="text-lg mb-2">No graph loaded</p>
                    <button
                      onClick={() => setView('onboarding')}
                      className="text-primary hover:underline"
                    >
                      Complete onboarding first →
                    </button>
                  </div>
                </div>
              ) : (
                <GraphCanvas
                  neighborhood={neighborhood}
                  loading={loading}
                  onNodeClick={handleNodeClick}
                  onFocusClick={(node) => setDetailNode(node)}
                />
              )}
            </div>
            {detailNode && (
              <NodeDetail
                node={detailNode}
                onClose={() => setDetailNode(null)}
              />
            )}
          </>
        )}

        {view === 'match' && (
          <div className="w-full flex flex-col items-center justify-center overflow-y-auto">
            {currentUserId && targetUserId ? (
              <MatchView
                currentUserId={currentUserId}
                targetUserId={targetUserId}
              />
            ) : (
              <div className="max-w-md w-full p-8 bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl">
                <h2 className="text-2xl font-bold mb-4">Compare Affinities</h2>
                <p className="text-white/60 text-sm mb-6">
                  Enter a target user ID to calculate graph similarity.
                  {!currentUserId && (
                    <span className="block mt-2 text-amber-400">⚠️ Complete onboarding first to set your user ID.</span>
                  )}
                </p>
                <input
                  type="text"
                  placeholder="Target User ID"
                  value={targetUserId}
                  onChange={e => setTargetUserId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors mb-4"
                />
                <button
                  disabled={!currentUserId || !targetUserId}
                  onClick={() => {/* MatchView will auto-fetch */}}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  Calculate Match
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
