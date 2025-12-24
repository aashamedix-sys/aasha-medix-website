
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Briefcase, Lock, AlertCircle } from 'lucide-react';

const StaffLogin = () => {
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
      
      navigate('/staff');
    } catch (err) {
      console.error('Staff login error:', err);
      const errorMsg = err.message === 'Invalid login credentials' ? 'Invalid credentials.' : err.message;
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Staff Login | AASHA MEDIX</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-blue-50/50 py-12 px-4">
        <Card className="w-full max-w-md p-8 shadow-lg rounded-2xl bg-white border-0">
          <div className="w-full flex justify-start mb-2">
            <Link to="/" className="text-sm font-semibold text-blue-700 hover:text-blue-800">← Back to Home</Link>
          </div>
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
               <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Staff Portal</h2>
            <p className="text-sm text-gray-500 mt-2">Authorized Personnel Only</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" /> {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID / Email</label>
               <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" placeholder="staff@aashamedix.com" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
               <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" placeholder="••••••••" />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access Portal"}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default StaffLogin;
