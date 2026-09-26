import { UserNode } from '../types';

interface HeaderProps {
  currentView: 'onboarding' | 'graph' | 'match' | 'login';
  setView: (view: 'onboarding' | 'graph' | 'match' | 'login') => void;
  canGoBack: boolean;
  onGoBack: () => void;
  currentUser: UserNode | null;
  onLogout: () => void;
}

export default function Header({
  currentView,
  setView,
  canGoBack,
  onGoBack,
  currentUser,
  onLogout,
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-white/10 bg-surface/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {canGoBack && currentView === 'graph' && (
          <button
            onClick={onGoBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white cursor-pointer"
            aria-label="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        )}
        <h1
          className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary cursor-pointer select-none"
          onClick={() => setView(currentUser ? 'graph' : 'login')}
        >
          Affinity
        </h1>
      </div>

      <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-lg">
        {(['graph', 'match'] as const).map(view => (
          <button
            key={view}
            onClick={() => setView(view)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-all duration-200 cursor-pointer ${
              currentView === view
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            {view}
          </button>
        ))}

        {!currentUser && (
          <>
            <button
              onClick={() => setView('login')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-all duration-200 cursor-pointer ${
                currentView === 'login'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setView('onboarding')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-all duration-200 cursor-pointer ${
                currentView === 'onboarding'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              Register
            </button>
          </>
        )}
      </nav>

      {/* User profile / session area */}
      <div className="flex items-center gap-3">
        {currentUser ? (
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs">
              👤
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-white leading-tight">
                {currentUser.displayName || currentUser.username}
              </div>
              <div className="text-[10px] text-white/40 leading-tight">
                @{currentUser.username}
              </div>
            </div>
            <button
              onClick={onLogout}
              className="ml-2 text-xs text-white/40 hover:text-rose-400 transition-colors p-1 cursor-pointer"
              title="Switch account / Logout"
            >
              Switch / Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setView('login')}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary hover:bg-primary/90 text-white transition-all shadow-md shadow-primary/20 cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
