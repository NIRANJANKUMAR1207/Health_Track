import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Activity, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
        await signup(name, email, password, role);
        navigate('/'); // Redirect to dashboard after signup
    } catch (err: any) {
        setError(err.message || 'Failed to create account');
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-teal-600 p-8 text-center">
            <div className="inline-flex p-3 bg-white/20 rounded-full mb-4">
                <UserPlus className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-teal-100 mt-2">Join Smart Health Analytics today</p>
        </div>
        
        <div className="p-8">
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}
            <form onSubmit={handleSignup} className="space-y-4">
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">I am a...</label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => setRole(UserRole.USER)}
                        className={`py-2 text-sm font-bold rounded-lg border ${
                            role === UserRole.USER 
                            ? 'bg-teal-50 border-teal-500 text-teal-700' 
                            : 'border-slate-200 text-slate-500 hover:border-teal-300'
                        }`}
                    >
                        Patient / User
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole(UserRole.DOCTOR)}
                        className={`py-2 text-sm font-bold rounded-lg border ${
                            role === UserRole.DOCTOR 
                            ? 'bg-teal-50 border-teal-500 text-teal-700' 
                            : 'border-slate-200 text-slate-500 hover:border-teal-300'
                        }`}
                    >
                        Doctor
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    placeholder="John Doe"
                />
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
                    placeholder="Create a password"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20 disabled:opacity-50"
            >
                {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
                <p>Already have an account? <Link to="/login" className="text-teal-600 font-semibold hover:underline">Log in</Link></p>
            </div>
        </div>
      </div>
    </div>
  );
};