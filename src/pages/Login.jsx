
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (!error) {
      toast({ title: "Login Successful!", description: "Redirecting to your dashboard..." });
      // The AuthProvider will handle role detection and navigation
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await signUp(email, password);
    if (error) {
      setLoading(false);
      return;
    }
    if (data.user) {
      // Add user to the 'patients' table
      const { error: profileError } = await supabase.from('patients').insert({
        user_id: data.user.id,
        name: name,
        email: email,
        mobile: phone,
      });

      if (profileError) {
        toast({ title: "Profile Creation Failed", description: profileError.message, variant: "destructive" });
      } else {
        toast({ title: "Sign Up Successful!", description: "Please check your email to verify your account." });
        setIsSignUp(false); // Switch back to login view
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img 
              src="https://horizons-cdn.hostinger.com/8e2a4de0-933a-452d-b0cc-4c06c5d99009/66575e0f062cf04ab11358231dfa3235.png" 
              alt="AASHA MEDIX" 
              className="h-16 mx-auto mb-2"
            />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">AASHA MEDIX Ecosystem</h1>
          <p className="text-gray-600">Secure Health Portal</p>
        </div>

        <Card>
          {!isSignUp ? (
            <>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Login to access your patient, staff, or admin portal.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
                  <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
                  <Button className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                  New patient?{' '}
                  <button onClick={() => setIsSignUp(true)} className="font-semibold text-green-700 hover:underline">
                    Create an account
                  </button>
                </p>
              </CardContent>
            </>
          ) : (
             <>
              <CardHeader>
                <CardTitle>Create Patient Account</CardTitle>
                <CardDescription>Get started with AASHA MEDIX today.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
                  <Input type="tel" placeholder="Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={loading} />
                  <Input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
                  <Input type="password" placeholder="Create a Password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
                  <Button className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                    {loading ? 'Creating account...' : 'Sign Up'}
                  </Button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                  Already have an account?{' '}
                  <button onClick={() => setIsSignUp(false)} className="font-semibold text-green-700 hover:underline">
                    Login here
                  </button>
                </p>
              </CardContent>
            </>
          )}
        </Card>
        <p className="text-xs text-gray-500 text-center mt-4">Staff and Admins log in with their assigned credentials.</p>
      </div>
    </div>
  );
};

export default Login;
