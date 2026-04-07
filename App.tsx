import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Layout } from './components/Layout';
import { AiAssistant } from './components/AiAssistant';
import { Tracker } from './pages/Tracker';
import { Profile } from './pages/Profile';
import { FileText, Download } from 'lucide-react';

// Reports Placeholder Component
const Reports = () => (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">My Health Reports</h1>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center">
                <div className="p-4 bg-red-50 rounded-lg mr-4">
                    <FileText className="text-red-500" size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Monthly Comprehensive Report</h3>
                    <p className="text-sm text-slate-500">October 2023 - PDF Analysis</p>
                </div>
            </div>
            <button className="flex items-center text-teal-600 hover:text-teal-700 font-medium">
                <Download size={18} className="mr-2" /> Download
            </button>
        </div>
    </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children }: React.PropsWithChildren<{}>) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

const AppContent = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/assistant" element={<ProtectedRoute><AiAssistant /></ProtectedRoute>} />
            <Route path="/tracker" element={<ProtectedRoute><Tracker /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            
            {/* Fallback for other routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
}

export default App;