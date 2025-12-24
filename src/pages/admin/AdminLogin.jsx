
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, ShieldCheck, Lock, AlertTriangle } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign in with correct parameters (email, password - not object)
      const { data, error: signInError } = await signIn(email, password);
      if (signInError) throw signInError;
      
      if (!data?.user?.id) {
        throw new Error('Login failed. User ID not obtained.');
      }

      // Small delay to ensure session is set
      await new Promise(resolve => setTimeout(resolve, 500));
      
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err.message || 'Access Denied. Invalid credentials or insufficient permissions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Admin Login | AASHA MEDIX</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
        <Card className="w-full max-w-md p-8 shadow-2xl rounded-xl bg-gray-800 border border-gray-700 text-white">
          <div className="w-full flex justify-start mb-3">
            <Link to="/" className="text-sm font-semibold text-gray-300 hover:text-white">← Back to Home</Link>
          </div>
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
               <ShieldCheck className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-wider">ADMIN CONSOLE</h2>
            <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">Restricted Access</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded mb-6 flex gap-3 text-sm items-center">
              <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
               <label className="text-xs font-medium text-gray-400 uppercase">Administrator Email</label>
               <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 bg-gray-900 border-gray-700 text-white placeholder-gray-600 focus:border-red-500 focus:ring-red-500" placeholder="admin@system.com" />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-medium text-gray-400 uppercase">Secure Key</label>
               <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 bg-gray-900 border-gray-700 text-white placeholder-gray-600 focus:border-red-500 focus:ring-red-500" placeholder="••••••••" />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded font-bold shadow-lg shadow-red-900/20 uppercase tracking-wide">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authenticate"}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default AdminLogin;
