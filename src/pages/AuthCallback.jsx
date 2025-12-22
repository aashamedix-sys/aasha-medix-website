import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        // 1) If a session already exists, redirect immediately
        const { data: { session } } = await supabase.auth.getSession();
        if (session && !cancelled) {
          navigate('/patient', { replace: true });
          return;
        }

        // 2) Try to exchange authorization code for a session (PKCE flow)
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code) {
          // Some versions accept window.location.href, others accept an object with code
          try {
            if (typeof supabase.auth.exchangeCodeForSession === 'function') {
              // Prefer the official API if available
              await supabase.auth.exchangeCodeForSession({ code });
            }
          } catch (_) {
            // Fallback: best-effort; supabase-js may auto-handle implicit flow
          }
        }

        // 3) After exchange, re-check session
        const { data: { session: newSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (newSession && !cancelled) {
          // Default to patient; ProtectedRoute will re-route staff/admin appropriately
          navigate('/patient', { replace: true });
        } else if (!cancelled) {
          // No session; go back to login
          navigate('/patient-login', { replace: true });
        }
      } catch (err) {
        console.error('[AuthCallback] Error:', err);
        if (!cancelled) {
          setError(err?.message || 'Authentication failed. Please try again.');
        }
      }
    };

    run();
    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#0FA958] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Completing sign in…</p>
        {error && (
          <p className="text-sm text-red-600 max-w-md text-center px-4">{error}</p>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
