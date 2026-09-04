import { BaseNode } from '../types';

interface NodeDetailProps {
  node: BaseNode | null;
  onClose: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  Genre: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  Artist: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  Movie: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Book: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Game: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Category: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  User: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

export default function NodeDetail({ node, onClose }: NodeDetailProps) {
  if (!node) return null;

  const badgeClass = TYPE_COLORS[node.type] || 'bg-primary/20 text-primary border-primary/30';

  return (
    <div className="absolute right-0 top-0 h-full w-80 bg-surface/90 backdrop-blur-md border-l border-white/10 shadow-2xl p-6 z-50 overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1"
        aria-label="Close detail panel"
      >
        {/* Inline X icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="mt-8">
        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider mb-3 ${badgeClass}`}>
          {node.type}
        </span>
        <h2 className="text-2xl font-bold text-white mb-2">{node.name || node.displayName}</h2>
        {node.canonicalId && (
          <p className="text-white/40 text-sm font-mono mb-4">{node.canonicalId}</p>
        )}

        {node.description && (
          <p className="text-white/80 text-sm leading-relaxed mb-6">
            {node.description}
          </p>
        )}

        {/* Connection strength slider (visual only for MVP) */}
        <div className="border-t border-white/10 pt-6 mt-6">
          <h3 className="text-white/60 text-sm uppercase font-semibold mb-4">Connection Strength</h3>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="75"
            className="w-full accent-primary bg-white/10 rounded-lg appearance-none h-2"
          />
          <div className="flex justify-between mt-2 text-xs text-white/40">
            <span>Weak</span>
            <span>Strong</span>
          </div>
        </div>

        {/* Node ID info */}
        <div className="border-t border-white/10 pt-6 mt-6">
          <h3 className="text-white/60 text-sm uppercase font-semibold mb-3">Node Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/40">Internal ID</span>
              <span className="text-white/70 font-mono text-xs">{node.id?.slice(0, 8)}…</span>
            </div>
            {node.canonicalId && (
              <div className="flex justify-between">
                <span className="text-white/40">Canonical</span>
                <span className="text-white/70 font-mono text-xs">{node.canonicalId}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
