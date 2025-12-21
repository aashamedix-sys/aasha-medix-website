
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

  const fetchUserRole = useCallback(async (userId) => {
    if (!userId) {
      setUserRole(null);
      return;
    }
    
    try {
      // 1. Check staff table first (includes admins)
      let { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (staffData) {
        setUserRole(staffData.role); 
        return;
      }

      // 2. Check admin_users table specifically (if separate from staff)
      let { data: adminData } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (adminData) {
        setUserRole('admin'); // Normalize to 'admin'
        return;
      }

      // 3. If not staff/admin, check if they are a patient
      let { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (patientData) {
        setUserRole('Patient');
        return;
      }

      // Default fallback
      setUserRole(null);
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole(null);
    }
  }, []);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    const currentUser = session?.user ?? null;
    setUser(currentUser);
    
    if (currentUser) {
      await fetchUserRole(currentUser.id);
    } else {
      setUserRole(null);
    }
    
    setLoading(false);
  }, [fetchUserRole]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        await handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Don't show toast here, let the component handle specific errors (like email not confirmed)
      console.error("Sign in error:", error.message);
    }
    return { data, error };
  }, []);

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
      window.location.href = '/'; // Force redirect to home
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

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
