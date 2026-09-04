import { useState } from 'react';
import { apiClient } from '../api/client';
import { OnboardingPayload } from '../types';

// Seed concepts matching the backend seed data with canonical IDs
const SEED_CONCEPTS = [
  // Music Genres
  { canonicalId: 'wd:Q11399', name: 'Rock', type: 'Genre', category: 'Music' },
  { canonicalId: 'wd:Q37073', name: 'Pop', type: 'Genre', category: 'Music' },
  { canonicalId: 'wd:Q6010', name: 'Rap/Hip-Hop', type: 'Genre', category: 'Music' },
  { canonicalId: 'wd:Q8341', name: 'Jazz', type: 'Genre', category: 'Music' },
  { canonicalId: 'wd:Q9778', name: 'Electronic', type: 'Genre', category: 'Music' },
  { canonicalId: 'wd:Q9730', name: 'Classical', type: 'Genre', category: 'Music' },
  { canonicalId: 'wd:Q38848', name: 'Metal', type: 'Genre', category: 'Music' },

  // Artists
  { canonicalId: 'wd:Q5608', name: 'Eminem', type: 'Artist', category: 'Music' },
  { canonicalId: 'wd:Q44191', name: 'Radiohead', type: 'Artist', category: 'Music' },
  { canonicalId: 'wd:Q1299', name: 'The Beatles', type: 'Artist', category: 'Music' },
  { canonicalId: 'wd:Q2274279', name: 'Kendrick Lamar', type: 'Artist', category: 'Music' },
  { canonicalId: 'wd:Q187941', name: 'Daft Punk', type: 'Artist', category: 'Music' },
  { canonicalId: 'wd:Q47100846', name: 'Billie Eilish', type: 'Artist', category: 'Music' },

  // Film Genres
  { canonicalId: 'wd:Q188473', name: 'Action', type: 'Genre', category: 'Film' },
  { canonicalId: 'wd:Q130232', name: 'Drama', type: 'Genre', category: 'Film' },
  { canonicalId: 'wd:Q471839', name: 'Sci-Fi', type: 'Genre', category: 'Film' },
  { canonicalId: 'wd:Q40831', name: 'Comedy', type: 'Genre', category: 'Film' },
  { canonicalId: 'wd:Q202866', name: 'Animation', type: 'Genre', category: 'Film' },

  // Movies
  { canonicalId: 'wd:Q25188', name: 'Inception', type: 'Movie', category: 'Film' },
  { canonicalId: 'wd:Q83495', name: 'The Matrix', type: 'Movie', category: 'Film' },
  { canonicalId: 'wd:Q163872', name: 'The Dark Knight', type: 'Movie', category: 'Film' },
  { canonicalId: 'wd:Q13417189', name: 'Interstellar', type: 'Movie', category: 'Film' },
  { canonicalId: 'wd:Q155438', name: 'Spirited Away', type: 'Movie', category: 'Film' },
  { canonicalId: 'wd:Q61896510', name: 'Parasite', type: 'Movie', category: 'Film' },

  // Books
  { canonicalId: 'wd:Q208460', name: '1984', type: 'Book', category: 'Books' },
  { canonicalId: 'wd:Q15228', name: 'Lord of the Rings', type: 'Book', category: 'Books' },
  { canonicalId: 'wd:Q190192', name: 'Dune', type: 'Book', category: 'Books' },
  { canonicalId: 'wd:Q21100042', name: 'Sapiens', type: 'Book', category: 'Books' },
];

const CATEGORIES = ['Music', 'Film', 'Books'] as const;

const TYPE_EMOJI: Record<string, string> = {
  Genre: '🏷️',
  Artist: '🎵',
  Movie: '🎬',
  Book: '📚',
};

export default function OnboardingFlow({ onComplete }: { onComplete: (userId: string) => void }) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedConcepts, setSelectedConcepts] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>('Music');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleConcept = (canonicalId: string) => {
    setSelectedConcepts(prev => {
      const next = new Set(prev);
      if (next.has(canonicalId)) next.delete(canonicalId);
      else next.add(canonicalId);
      return next;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload: OnboardingPayload = {
        username,
        displayName: displayName || username,
        selectedConceptIds: Array.from(selectedConcepts),
      };
      const res = await apiClient.submitOnboarding(payload);
      onComplete(res.user.id);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Error saving profile');
    } finally {
      setLoading(false);
    }
  };

  const filteredConcepts = SEED_CONCEPTS.filter(c => c.category === activeCategory);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        {/* Step indicator */}
        <div className="flex mb-8 justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10 -translate-y-1/2"></div>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= i
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-surface border border-white/20 text-white/40'
              }`}
            >
              {step > i ? '✓' : i}
            </div>
          ))}
        </div>

        {/* Step 1: Identity */}
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome to Affinity</h2>
            <p className="text-white/60 mb-8">Build your identity graph. Start by telling us who you are.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Username</label>
                <input
                  type="text"
                  placeholder="e.g. alice"
                  value={username}
                  onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alice"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <button
              disabled={!username.trim()}
              onClick={() => setStep(2)}
              className="mt-8 w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Seed interests */}
        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold mb-2">Your Interests</h2>
            <p className="text-white/60 mb-6">
              Select concepts to seed your identity graph.
              <span className="text-primary ml-2 font-semibold">{selectedConcepts.size} selected</span>
            </p>

            {/* Category tabs */}
            <div className="flex gap-2 mb-6">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Concept grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[340px] overflow-y-auto pr-1">
              {filteredConcepts.map(c => (
                <button
                  key={c.canonicalId}
                  onClick={() => toggleConcept(c.canonicalId)}
                  className={`p-4 rounded-xl border transition-all text-left group ${
                    selectedConcepts.has(c.canonicalId)
                      ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/10'
                      : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{TYPE_EMOJI[c.type] || '•'}</span>
                    <span className="text-xs text-white/40 uppercase tracking-wider">{c.type}</span>
                  </div>
                  <div className="font-semibold">{c.name}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(1)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-lg transition-colors">
                ← Back
              </button>
              <button
                disabled={selectedConcepts.size === 0}
                onClick={() => setStep(3)}
                className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div>
            <h2 className="text-3xl font-bold mb-2">Ready to explore</h2>
            <p className="text-white/60 mb-8">Your identity graph is ready to be created.</p>

            <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
              <div className="text-sm text-white/50 mb-1">User</div>
              <div className="text-xl font-bold mb-4">{displayName || username} <span className="text-white/30 text-sm font-normal">@{username}</span></div>
              <div className="text-sm text-white/50 mb-2">Seed Concepts ({selectedConcepts.size})</div>
              <div className="flex flex-wrap gap-2">
                {Array.from(selectedConcepts).map(canonicalId => {
                  const c = SEED_CONCEPTS.find(x => x.canonicalId === canonicalId);
                  return c ? (
                    <span key={canonicalId} className="px-3 py-1.5 bg-primary/15 text-primary border border-primary/20 rounded-full text-xs font-medium">
                      {TYPE_EMOJI[c.type]} {c.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-6 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-lg transition-colors">
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-[2] bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Generating Graph...
                  </span>
                ) : (
                  'Enter Affinity ✨'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
