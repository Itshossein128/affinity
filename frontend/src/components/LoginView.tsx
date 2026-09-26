import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { UserNode } from '../types';

interface LoginViewProps {
  onLoginSuccess: (user: UserNode) => void;
  onSwitchToOnboarding: () => void;
}

export default function LoginView({ onLoginSuccess, onSwitchToOnboarding }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [availableUsers, setAvailableUsers] = useState<UserNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    apiClient.listUsers()
      .then(res => {
        if (mounted) setAvailableUsers(res.users);
      })
      .catch(err => {
        console.warn('Could not load user list:', err);
      })
      .finally(() => {
        if (mounted) setFetchingUsers(false);
      });
    return () => { mounted = false; };
  }, []);

  const handleLogin = async (targetUsername?: string) => {
    const userToLogin = (targetUsername || username).trim();
    if (!userToLogin) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.login(userToLogin);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Login failed. User not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-fade-in my-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-primary/20">
          ♾️
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back to Affinity</h2>
        <p className="text-white/60 text-sm">
          Log in to explore and interact with your personal interest graph.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. itshossein128, alice, bob"
            autoFocus
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !username.trim()}
          className="w-full py-3.5 px-6 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Logging in...</span>
            </>
          ) : (
            <span>Log In & View Graph →</span>
          )}
        </button>
      </form>

      {/* Quick selection of detected users */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
          Or select an existing profile:
        </p>
        {fetchingUsers ? (
          <div className="text-xs text-white/30 py-2">Loading profiles...</div>
        ) : availableUsers.length === 0 ? (
          <div className="text-xs text-white/30 py-2">No users found. Create one below!</div>
        ) : (
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
            {availableUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  setUsername(u.username);
                  handleLogin(u.username);
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/50 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                    👤
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                      {u.displayName || u.username}
                    </div>
                    <div className="text-xs text-white/40">@{u.username}</div>
                  </div>
                </div>
                {u.interestCount !== undefined && (
                  <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                    {u.interestCount} interests
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Switch to Onboarding */}
      <div className="mt-6 pt-6 border-t border-white/10 text-center">
        <p className="text-sm text-white/60">
          New here?{' '}
          <button
            type="button"
            onClick={onSwitchToOnboarding}
            className="text-primary hover:underline font-semibold cursor-pointer"
          >
            Build your identity graph →
          </button>
        </p>
      </div>
    </div>
  );
}
