import { useState, useEffect } from 'react';
import Header from './components/Header';
import GraphCanvas from './components/GraphCanvas';
import NodeDetail from './components/NodeDetail';
import OnboardingFlow from './components/OnboardingFlow';
import LoginView from './components/LoginView';
import MatchView from './components/MatchView';
import { useGraph } from './hooks/useGraph';
import { BaseNode, UserNode } from './types';

type ViewState = 'onboarding' | 'graph' | 'match' | 'login';

const STORAGE_KEY = 'affinity_user';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserNode | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).id : null;
    } catch {
      return null;
    }
  });

  const [view, setView] = useState<ViewState>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ? 'graph' : 'login';
    } catch {
      return 'login';
    }
  });

  const [detailNode, setDetailNode] = useState<BaseNode | null>(null);
  const [targetUserId, setTargetUserId] = useState<string>('');

  const {
    neighborhood,
    loading,
    navigateTo,
    goBack,
    canGoBack
  } = useGraph(currentUserId);

  // Sync state when currentUser changes
  useEffect(() => {
    if (currentUser?.id) {
      setCurrentUserId(currentUser.id);
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: UserNode) => {
    setCurrentUser(user);
    setCurrentUserId(user.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setView('graph');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserId(null);
    localStorage.removeItem(STORAGE_KEY);
    setView('login');
  };

  const handleOnboardingComplete = (user: any) => {
    const userObj: UserNode = {
      id: user.id,
      username: user.username,
      displayName: user.displayName || user.username,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
    handleLoginSuccess(userObj);
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
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-1 relative flex overflow-hidden">
        {view === 'login' && (
          <div className="w-full flex items-center justify-center overflow-y-auto">
            <LoginView
              onLoginSuccess={handleLoginSuccess}
              onSwitchToOnboarding={() => setView('onboarding')}
            />
          </div>
        )}

        {view === 'onboarding' && (
          <div className="w-full flex items-center justify-center overflow-y-auto">
            <OnboardingFlow
              onComplete={handleOnboardingComplete}
              onSwitchToLogin={() => setView('login')}
            />
          </div>
        )}

        {view === 'graph' && (
          <>
            <div className="flex-1 relative">
              {!currentUserId ? (
                <div className="flex items-center justify-center h-full text-white/40">
                  <div className="text-center max-w-sm p-6 bg-surface/40 rounded-2xl border border-white/10">
                    <p className="text-lg font-semibold text-white mb-2">No Account Connected</p>
                    <p className="text-sm text-white/60 mb-6">
                      Log in with your existing username or create a new graph to get started.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setView('login')}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold cursor-pointer"
                      >
                        Log In
                      </button>
                      <button
                        onClick={() => setView('onboarding')}
                        className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg text-sm font-semibold cursor-pointer"
                      >
                        Create Graph
                      </button>
                    </div>
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
                  Enter a target user ID or username to calculate graph similarity.
                  {!currentUserId && (
                    <span className="block mt-2 text-amber-400">⚠️ Please log in first to calculate your affinity match.</span>
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
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
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
