import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

// Note: This page is now a lightweight redirect to the new, dynamic
// Supabase-backed price list at `/test-price-list` to ensure a single
// source of truth across the app.
export default function PriceList() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect immediately to the unified price list page
    navigate('/test-price-list', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0FA958] to-[#0d8847] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/" className="text-white/80 hover:text-white transition-colors">
              <Home className="w-5 h-5" />
            </Link>
            <span className="text-white/60">/</span>
            <span>Price List</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Redirecting to Updated Price List</h1>
          <p className="text-green-100 max-w-3xl">You’ll be taken to our latest, unified price list page.</p>
          <div className="mt-6">
            <Link to="/test-price-list" className="inline-block bg-white text-[#0FA958] font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg">
              Go now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
