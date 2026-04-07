import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
        await login(email, password);
    } catch (err: any) {
        setError(err.message || 'Failed to sign in');
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-teal-600 p-8 text-center">
            <div className="inline-flex p-3 bg-white/20 rounded-full mb-4">
                <Activity className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-teal-100 mt-2">Sign in to Smart Health Analytics</p>
        </div>
        
        <div className="p-8">
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <div className="grid grid-cols-3 gap-2">
                    {[UserRole.USER, UserRole.DOCTOR, UserRole.ADMIN].map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={`py-2 text-xs font-bold uppercase rounded-lg border ${
                                role === r 
                                ? 'bg-teal-50 border-teal-500 text-teal-700' 
                                : 'border-slate-200 text-slate-500 hover:border-teal-300'
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    placeholder="name@example.com"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20 disabled:opacity-50"
            >
                {loading ? 'Signing In...' : 'Login'}
            </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
                <p>Don't have an account? <Link to="/signup" className="text-teal-600 font-semibold hover:underline">Sign Up</Link></p>
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                    <p>Demo Credentials:</p>
                    <p>Any email/password works. Select role above.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};