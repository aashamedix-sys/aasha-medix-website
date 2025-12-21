import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Home, UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

function parseCSV(text) {
  // Minimal CSV parser assuming no embedded newlines in fields.
  // Handles quoted values and commas.
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const raw = lines[i];
    // Split respecting quotes
    const values = [];
    let cur = '';
    let inQuotes = false;
    for (let ch of raw) {
      if (ch === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (ch === ',' && !inQuotes) {
        values.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    values.push(cur);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = (values[idx] ?? '').trim();
    });
    rows.push(obj);
  }
  return rows;
}

export default function ImportPrices() {
  const [testsCSV, setTestsCSV] = useState(null);
  const [packagesCSV, setPackagesCSV] = useState(null);
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

  const upsertTests = async (rows) => {
    // Map CSV to Supabase columns
    const payload = rows.map(r => ({
      code: r.code || null,
      name: r.name || null,
      category: r.category || null,
      mrp: r.mrp ? Number(r.mrp) : null,
      sample_type: r.sample_type || null,
      tat: r.tat || null,
      is_active: String(r.is_active).toLowerCase() === 'true',
      description: r.description || null,
    })).filter(x => x.name);
    const { error } = await supabase.from('tests').upsert(payload, { onConflict: 'code' });
    if (error) throw error;
    return payload.length;
  };

  const upsertPackages = async (rows) => {
    const payload = rows.map(r => ({
      code: r.code || null,
      name: r.name || null,
      mrp: r.mrp ? Number(r.mrp) : null,
      tests_included: r.tests_included || null,
      description: r.description || null,
      is_active: String(r.is_active).toLowerCase() === 'true',
    })).filter(x => x.name);
    const { error } = await supabase.from('health_packages').upsert(payload, { onConflict: 'code' });
    if (error) throw error;
    return payload.length;
  };

  const handleImport = async () => {
    try {
      setStatus({ loading: true, message: '', error: '' });
      let testsCount = 0, packagesCount = 0;

      if (testsCSV) {
        const text = await testsCSV.text();
        const rows = parseCSV(text);
        testsCount = await upsertTests(rows);
      }
      if (packagesCSV) {
        const text = await packagesCSV.text();
        const rows = parseCSV(text);
        packagesCount = await upsertPackages(rows);
      }

      setStatus({ loading: false, message: `Imported ${testsCount} tests and ${packagesCount} packages successfully.`, error: '' });
    } catch (err) {
      console.error('Import failed:', err);
      setStatus({ loading: false, message: '', error: err.message || 'Import failed' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Helmet><title>Admin: Import Price List - AASHA MEDIX</title></Helmet>
      <div className="bg-gradient-to-r from-[#0FA958] to-[#0d8847] text-white py-14">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/" className="text-white/80 hover:text-white transition-colors">
              <Home className="w-5 h-5" />
            </Link>
            <span className="text-white/60">/</span>
            <span>Admin</span>
            <span className="text-white/60">/</span>
            <span>Import Price List</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Import Price List</h1>
          <p className="text-green-100 max-w-3xl">Upload CSVs generated from your official PDF to update tests and health packages.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Tests CSV</h2>
              <p className="text-sm text-gray-600 mb-3">Expected headers: <span className="font-mono">code,name,category,mrp,sample_type,tat,is_active,description</span></p>
              <input type="file" accept=".csv" onChange={(e) => setTestsCSV(e.target.files?.[0] || null)} className="block w-full border rounded-lg p-2" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Health Packages CSV</h2>
              <p className="text-sm text-gray-600 mb-3">Expected headers: <span className="font-mono">code,name,mrp,tests_included,description,is_active</span></p>
              <input type="file" accept=".csv" onChange={(e) => setPackagesCSV(e.target.files?.[0] || null)} className="block w-full border rounded-lg p-2" />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button onClick={handleImport} disabled={status.loading} className="inline-flex items-center gap-2 bg-[#0FA958] text-white px-5 py-3 rounded-full shadow-md hover:shadow-lg">
              <UploadCloud className="w-5 h-5" />
              {status.loading ? 'Importing…' : 'Import Now'}
            </button>
            {status.message && (
              <span className="inline-flex items-center gap-2 text-emerald-700">
                <CheckCircle className="w-5 h-5" /> {status.message}
              </span>
            )}
            {status.error && (
              <span className="inline-flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" /> {status.error}
              </span>
            )}
          </div>

          <div className="mt-8 text-sm text-gray-600">
            <p>Tip: Use the templates in <span className="font-mono">data/tests_import_template.csv</span> and <span className="font-mono">data/packages_import_template.csv</span>. Export data from your PDF into these CSVs and upload here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
