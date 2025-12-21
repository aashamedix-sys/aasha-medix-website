
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Printer, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Badge } from '@/components/ui/badge';

const getCategoryColor = (category) => {
  const map = {
    General: 'bg-emerald-100 text-emerald-700',
    Blood: 'bg-rose-100 text-rose-700',
    Urine: 'bg-amber-100 text-amber-700',
    Thyroid: 'bg-violet-100 text-violet-700',
  };
  return map[category] || 'bg-slate-100 text-slate-700';
};

const TestPriceList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [categories, setCategories] = useState(['All Categories']);

  useEffect(() => {
    fetchTests();
  }, []);

  const parseCSV = (text) => {
    const lines = text.trim().split(/\r?\n/);
    if (!lines.length) return [];
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const raw = lines[i];
      if (!raw.trim()) continue;
      const values = [];
      let cur = '';
      let inQuotes = false;
      for (let j = 0; j < raw.length; j++) {
        const ch = raw[j];
        if (ch === '"') {
          if (inQuotes && raw[j+1] === '"') { cur += '"'; j++; continue; }
          inQuotes = !inQuotes; continue;
        }
        if (ch === ',' && !inQuotes) { values.push(cur); cur = ''; }
        else { cur += ch; }
      }
      values.push(cur);
      const obj = {};
      headers.forEach((h, idx) => { obj[h] = (values[idx] ?? '').trim(); });
      rows.push(obj);
    }
    return rows;
  };

  const mapCsvRowsToTests = (rows) => {
    return rows.map(r => {
      const get = (obj, keys) => {
        for (const k of keys) { if (obj[k] != null && String(obj[k]).length) return obj[k]; }
        return null;
      };
      const code = get(r, ['Code','code']);
      const rawName = get(r, ['Test Name','name']);
      const rawSample = get(r, ['Sample','sample','sample_type']);
      const rawTat = get(r, ['Report Time','report_time','TAT','tat']);
      const mrpRaw = get(r, ['MRP','mrp']);
      const normalizeDash = (str) => str ? str.replace(/â€“|–|—/g, '–') : str; // normalize en-dash artifacts
      const name = normalizeDash(rawName);
      const sample = normalizeDash(rawSample);
      const tat = normalizeDash(rawTat);
      const mrp = mrpRaw ? Number(String(mrpRaw).replace(/[^0-9.]/g,'')) : null;
      const category = 'General';
      return {
        id: code || name,
        code,
        name,
        category,
        description: null,
        mrp,
        sample_type: sample,
        tat,
      };
    }).filter(t => t.name);
  };

  const loadFromCsvFallback = async () => {
    const res = await fetch('/assets/prices/tests.csv');
    if (!res.ok) throw new Error('Fallback CSV not found');
    const text = await res.text();
    const rows = parseCSV(text);
    const mapped = mapCsvRowsToTests(rows);
    setTests(mapped);
    const uniqueCats = ['All Categories', ...new Set(mapped.map(t => t.category || 'General'))].sort();
    setCategories(uniqueCats);
  };

  const fetchTests = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('tests')
        .select('id, code, name, category, description, mrp, sample_type, tat')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;

      if (data && data.length) {
        setTests(data);
        const uniqueCats = ['All Categories', ...new Set(data.map(t => t.category || 'General'))].sort();
        setCategories(uniqueCats);
      } else {
        await loadFromCsvFallback();
      }
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Supabase fetch failed, using CSV fallback:', err);
      try {
        await loadFromCsvFallback();
      } catch (fallbackErr) {
        if (import.meta.env.DEV) console.error('CSV fallback failed:', fallbackErr);
        setError('Failed to load test prices. Please try again.');
        toast({ title: 'Error', description: 'Could not fetch test prices.', variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = useMemo(() => {
    return tests.filter(test => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (test.name && test.name.toLowerCase().includes(q)) ||
        (test.code && test.code.toLowerCase().includes(q)) ||
        (test.description && test.description.toLowerCase().includes(q));
      const matchesCategory = selectedCategory === 'All Categories' || test.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tests, searchQuery, selectedCategory]);

  return (
    <>
      <Helmet>
        <title>AASHA MEDIX | Test Price List</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-10">
        <div className="container mx-auto px-4 max-w-6xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Diagnostic Test Price List</h1>
            <p className="text-slate-600 text-sm md:text-base">Transparent MRP pricing • NABL labs • Fast reports</p>
          </div>

          <div className="mt-4">
            <div className="mx-auto max-w-3xl bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-3 md:p-4">
              <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-4">
                <div className="flex flex-1 items-center gap-2 bg-white rounded-xl border border-gray-200 px-2 py-1 shadow-xs">
                  <Input
                    aria-label="Search tests"
                    placeholder="Search test name, category, or sample type…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setSearchQuery((prev) => prev.trim()); }}
                    className="h-12 md:h-12 text-base md:text-lg rounded-lg border-0 focus-visible:ring-0"
                  />
                  <Button
                    variant="secondary"
                    className="h-11 md:h-12 rounded-lg px-3 gap-2"
                    onClick={() => setSearchQuery((prev) => prev.trim())}
                    title="Search tests"
                    aria-label="Search tests"
                  >
                    <Search className="w-4 h-4" />
                    Search
                  </Button>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 md:h-12 rounded-xl md:w-56">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent align="end" className="max-h-72 overflow-auto">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        <span className="flex justify-between w-full gap-2 items-center">
                          {cat}
                          {cat !== 'All Categories' && (
                            <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-500">
                              {tests.filter((t) => t.category === cat).length}
                            </span>
                          )}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className="h-12 md:h-12 rounded-xl px-4"
                  onClick={() => window.print()}
                  title="Print Price List"
                  aria-label="Print price list"
                >
                  <Printer className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Fetching latest prices...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-2xl border border-red-100 text-center px-4">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-lg font-bold text-red-700 mb-2">Unable to Load Tests</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <Button onClick={fetchTests} variant="destructive" className="gap-2">
                <RefreshCw className="w-4 h-4" /> Retry
              </Button>
            </div>
          ) : filteredTests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <Search className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No tests found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Categories');
                }}
                className="mt-2 text-emerald-600"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100">
              <div className="overflow-x-auto hidden md:block">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      <th className="p-5 pl-6 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[100px]">Code</th>
                      <th className="p-5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Test Name</th>
                      <th className="p-5 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[160px]">Category</th>
                      <th className="p-5 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center hidden md:table-cell w-[140px]">Sample</th>
                      <th className="p-5 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center hidden md:table-cell w-[120px]">TAT</th>
                      <th className="p-5 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right w-[120px]">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTests.map((test) => (
                      <tr key={test.id} className="hover:bg-emerald-50/40 transition-colors group">
                        <td className="p-5 pl-6 align-middle">
                          <span className="font-mono text-[11px] text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                            {test.code || 'N/A'}
                          </span>
                        </td>
                        <td className="p-5 align-middle">
                          <div>
                            <p className="font-semibold text-slate-900 text-sm md:text-base">{test.name}</p>
                            {test.description && (
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                                {test.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-5 align-middle">
                          <Badge
                            variant="secondary"
                            className={`${getCategoryColor(test.category)} border-0 font-medium rounded-full px-3 py-1`}
                          >
                            {test.category}
                          </Badge>
                        </td>
                        <td className="p-5 text-center align-middle hidden md:table-cell text-sm text-gray-600">
                          {test.sample_type || '-'}
                        </td>
                        <td className="p-5 text-center align-middle hidden md:table-cell text-sm text-gray-600">
                          {test.tat || '-'}
                        </td>
                        <td className="p-5 text-right align-middle">
                          <span className="font-bold text-medical-green text-lg">₹{test.mrp}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid md:hidden gap-3">
                {filteredTests.map((test) => (
                  <div key={test.id} className="rounded-xl border border-gray-100 p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900 text-base">{test.name}</p>
                        {test.description && <p className="text-xs text-gray-500 mt-0.5">{test.description}</p>}
                      </div>
                      <span className={`text-xs font-medium ${getCategoryColor(test.category)} rounded-full px-2.5 py-1`}>{test.category}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">Code</p>
                        <p className="font-mono text-xs text-gray-700">{test.code || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">Sample</p>
                        <p className="text-xs">{test.sample_type || '-'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">TAT</p>
                        <p className="text-xs">{test.tat || '-'}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500">Inclusive of all taxes</span>
                      <span className="font-bold text-medical-green text-lg">₹{test.mrp}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-gray-50 border-t flex justify-between items-center text-sm text-gray-500">
                <span>Showing {filteredTests.length} tests</span>
                <span className="hidden sm:inline">Prices are subject to change without prior notice.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TestPriceList;
