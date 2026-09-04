interface HeaderProps {
  currentView: 'onboarding' | 'graph' | 'match';
  setView: (view: 'onboarding' | 'graph' | 'match') => void;
  canGoBack: boolean;
  onGoBack: () => void;
}

export default function Header({ currentView, setView, canGoBack, onGoBack }: HeaderProps) {
  return (
    <header className="h-16 border-b border-white/10 bg-surface/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {canGoBack && currentView === 'graph' && (
          <button
            onClick={onGoBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
            aria-label="Go back"
          >
            {/* Inline SVG arrow-left icon — no external dependencies */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        )}
        <h1
          className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary cursor-pointer"
          onClick={() => setView('graph')}
        >
          Affinity
        </h1>
      </div>

      <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-lg">
        {(['graph', 'match', 'onboarding'] as const).map(view => (
          <button
            key={view}
            onClick={() => setView(view)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-all duration-200 ${
              currentView === view
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            {view}
          </button>
        ))}
      </nav>
    </header>
  );
}
