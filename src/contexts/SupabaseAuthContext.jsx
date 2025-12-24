
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  const fetchUserRole = useCallback(async (userId, userEmail) => {
    if (!userId) {
      console.log('[Auth] No userId provided, setting role to null');
      setUserRole(null);
      return null;
    }
    
    console.log('[Auth] Fetching role for userId:', userId, 'email:', userEmail);
    
    try {
      // Priority 1: Check admin_users table (highest privilege)
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('role, email')
        .eq('user_id', userId)
        .maybeSingle();

      if (adminData && !adminError) {
        console.log('[Auth] ✓ Found in admin_users table:', adminData);
        setUserRole('admin');
        return 'admin';
      }

      // Priority 2: Check staff table
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('role, email')
        .eq('user_id', userId)
        .maybeSingle();

      if (staffData && !staffError) {
        console.log('[Auth] ✓ Found in staff table:', staffData);
        setUserRole('staff');
        return 'staff';
      }

      // Priority 3: Check patients table
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id, email')
        .eq('user_id', userId)
        .maybeSingle();

      if (patientData && !patientError) {
        console.log('[Auth] ✓ Found in patients table:', patientData);
        setUserRole('patient');
        return 'patient';
      }

      // Fallback: Force role based on email patterns
      if (userEmail) {
        if (userEmail.includes('care@') || userEmail.includes('admin@')) {
          console.log('[Auth] ⚠️ Fallback to admin based on email pattern');
          setUserRole('admin');
          return 'admin';
        }
        if (userEmail.includes('staff')) {
          console.log('[Auth] ⚠️ Fallback to staff based on email pattern');
          setUserRole('staff');
          return 'staff';
        }
        if (userEmail.includes('patient')) {
          console.log('[Auth] ⚠️ Fallback to patient based on email pattern');
          setUserRole('patient');
          return 'patient';
        }
      }

      console.warn('[Auth] ✗ No role found for user:', userId, userEmail);
      setUserRole(null);
      return null;
    } catch (error) {
      console.error('[Auth] Error fetching user role:', error);
      setUserRole(null);
      return null;
    }
  }, []);

  const handleSession = useCallback(async (session) => {
    console.log('[Auth] handleSession called, session exists:', !!session);
    
    setSession(session);
    const currentUser = session?.user ?? null;
    setUser(currentUser);
    
    if (currentUser) {
      console.log('[Auth] User authenticated:', currentUser.email);
      await fetchUserRole(currentUser.id, currentUser.email);
    } else {
      console.log('[Auth] No user in session');
      setUserRole(null);
    }
    
    setLoading(false);
    console.log('[Auth] Loading complete');
  }, [fetchUserRole]);

  useEffect(() => {
    console.log('[Auth] Initializing auth context...');
    
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[Auth] Error getting session:', error);
        }
        await handleSession(session);
      } catch (err) {
        console.error('[Auth] Exception during getSession:', err);
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] Auth state changed:', event);
        await handleSession(session);
      }
    );

    return () => {
      console.log('[Auth] Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [handleSession]);

  const signUp = useCallback(async (email, password, options) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "Something went wrong",
      });
    }
    return { data, error };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    console.log('[Auth] Attempting sign in for:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[Auth] Sign in error:', error.message);
      return { data, error };
    }

    if (data?.user) {
      console.log('[Auth] Sign in successful, fetching role...');
      // Fetch role immediately after sign in
      await fetchUserRole(data.user.id, data.user.email);
    }

    return { data, error };
  }, [fetchUserRole]);

  // Phone OTP Authentication
  const signInWithPhone = useCallback(async (phone) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phone,
    });

    if (error) {
      console.error("Phone OTP error:", error.message);
    }
    return { data, error };
  }, []);

  // Verify OTP
  const verifyPhoneOtp = useCallback(async (phone, token) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone,
      token: token,
      type: 'sms',
    });

    if (error) {
      console.error("OTP verification error:", error.message);
    }
    return { data, error };
  }, []);

  // Google OAuth Authentication
  const signInWithGoogle = useCallback(async (redirectUrl) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl || `${window.location.origin}/patient`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error("Google OAuth error:", error.message);
    }
    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    console.log('[Auth] Signing out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out Failed",
        description: error.message,
      });
    } else {
      setUserRole(null);
      setUser(null);
      setSession(null);
      window.location.href = '/';
    }
    return { error };
  }, [toast]);

  const value = useMemo(() => ({
    user,
    session,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithPhone,
    verifyPhoneOtp,
    signInWithGoogle,
  }), [user, session, userRole, loading, signUp, signIn, signOut, signInWithPhone, verifyPhoneOtp, signInWithGoogle]);

  // Always render children, but with loading state
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
