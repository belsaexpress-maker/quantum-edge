import React, { useState } from 'react';
import axios from 'axios';
import { Brain, User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

interface AuthProps {
  onLogin: (user: { username: string; email: string; token: string }) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const { t } = useLang();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const data = mode === 'login' ? { username, password } : { username, email, password };
      const res = await axios.post(`http://localhost:8000/api${endpoint}`, data);
      if (res.data?.access_token) {
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onLogin({ ...res.data.user, token: res.data.access_token });
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] bg-grid px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 mb-3">
            <Brain size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Quantum Edge</h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Professional Trading Platform</p>
        </div>

        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5">
          <div className="flex mb-5">
            <button onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'login' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)] hover:text-white'}`}>
              {t('sign_in')}
            </button>
            <button onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'register' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)] hover:text-white'}`}>
              {t('register')}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs text-[var(--color-text-muted)] mb-1">{t('username')}</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-accent)]" placeholder="username" required />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs text-[var(--color-text-muted)] mb-1">{t('email')}</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-accent)]" placeholder="email@example.com" required />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs text-[var(--color-text-muted)] mb-1">{t('password')}</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-accent)]" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-white">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> : <>{mode === 'login' ? t('sign_in') : t('create_account')} <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--color-border)]"></div></div>
            <div className="relative flex justify-center text-xs"><span className="px-2 bg-[var(--color-bg-card)] text-[var(--color-text-muted)]">{t('or_continue')}</span></div>
          </div>

          <button type="button"
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-[var(--color-border)] rounded-lg text-sm font-medium hover:bg-[var(--color-bg-hover)] transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
        </div>

        <p className="text-center text-xs text-[var(--color-text-muted)] mt-4">
          {mode === 'login' ? t('dont_have') : t('already_have')}{' '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="text-[var(--color-accent)] hover:underline">
            {mode === 'login' ? t('register') : t('sign_in')}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;