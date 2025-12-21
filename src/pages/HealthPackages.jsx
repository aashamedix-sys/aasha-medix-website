import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { fetchPackages } from '@/lib/packagesData';

const badgeClass = 'bg-emerald-100 text-emerald-700 rounded-full px-3 py-1 text-xs font-medium';

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: 'easeOut' },
};

const HealthPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await fetchPackages();
      setPackages(data);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return packages.filter((p) => {
      const name = (p.name || '').toLowerCase();
      const summary = (p.testsSummary || '').toLowerCase();
      const matchesFilter =
        filter === 'All' ? true :
        filter === 'Popular' ? p.popular :
        (filter === 'Men' && name.includes('men')) ||
        (filter === 'Women' && name.includes('women')) ||
        (filter === 'Senior' && (name.includes('senior') || name.includes('elder'))) ||
        (filter === 'Diabetes' && name.includes('diabetes')) ||
        (filter === 'Heart' && (name.includes('cardiac') || name.includes('heart'))) ||
        (filter === 'Full Body' && name.includes('full body'));

      const matchesSearch = !q || name.includes(q) || summary.includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [packages, filter, searchQuery]);

  const limitedPopularIds = useMemo(() => {
    return filtered.filter((p) => p.popular).slice(0, 3).map((p) => p.id || p.name);
  }, [filtered]);

  const visiblePackages = useMemo(() => {
    if (showAll) return filtered;
    const popularTop = filtered.filter((p) => p.popular).slice(0, 3);
    const remaining = filtered.filter((p) => !popularTop.includes(p)).slice(0, 3);
    return [...popularTop, ...remaining];
  }, [filtered, showAll]);

  return (
    <>
      <Helmet>
        <title>AASHA MEDIX | Profiles & Health Packages</title>
      </Helmet>

      {/* Top padding keeps content clear of sticky header */}
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pt-24 md:pt-28 pb-14 md:pb-16">
        <div className="container mx-auto px-4 max-w-6xl space-y-7">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Profiles & Health Packages</h1>
            <p className="text-slate-600 text-sm md:text-base">Curated diagnostics • Transparent MRP • Trusted NABL labs</p>
          </div>

          <div className="mx-auto max-w-5xl bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm p-3 md:p-4 flex flex-col gap-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2">
                <Input
                  aria-label="Search packages"
                  placeholder="Search package name or included tests…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setSearchQuery((prev) => prev.trim()); }}
                  className="h-12 md:h-12 text-base rounded-xl"
                />
                <Button
                  className="h-12 md:h-12 rounded-xl px-4 gap-2"
                  onClick={() => setSearchQuery((prev) => prev.trim())}
                  title="Search packages"
                >
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>
              {packages.length < 10 && !loading && (
                <p className="text-xs text-gray-500 mt-1">Browse curated health packages below</p>
              )}
              <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                {['All','Popular','Men','Women','Senior','Diabetes','Heart','Full Body'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3.5 py-1.5 text-sm rounded-full border transition-all duration-200 ${filter===f?'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-[0_6px_20px_-12px_rgba(16,185,129,0.6)]':'bg-white text-slate-700 border-gray-200 hover:border-emerald-200 hover:text-emerald-700'}`}
                    aria-pressed={filter===f}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24"><span className="text-slate-600">Loading packages…</span></div>
          ) : (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visiblePackages.map((p, idx) => (
                <motion.div
                  key={p.id || idx}
                  initial={fadeInUp.initial}
                  animate={fadeInUp.animate}
                  transition={{ ...fadeInUp.transition, delay: idx * 0.02 }}
                  whileHover={{ y: -4 }}
                  className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:border-emerald-100 transition-all duration-300 will-change-transform"
                >
                  <div className="p-5 space-y-3">
                    {/* Package title is strongest visual element */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">{p.name}</h3>
                      {p.popular && limitedPopularIds.includes(p.id || p.name) && <span className={badgeClass}>Popular</span>}
                    </div>

                    {/* Short, readable summary of included tests */}
                    {p.testsSummary && (
                      <p className="text-sm text-slate-600 line-clamp-3">{p.testsSummary}</p>
                    )}

                    {/* Muted meta info for sample & TAT */}
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">Sample</p>
                        <p className="text-sm">{p.sample || '-'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">TAT</p>
                        <p className="text-sm">{p.tat || '-'}</p>
                      </div>
                    </div>

                    {/* Price highlighted in brand green; clear CTA */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-extrabold text-medical-green text-xl">₹{p.mrp ?? '-'}</span>
                      <Button className="rounded-xl h-11 px-5 text-sm font-semibold transition-transform duration-200 hover:scale-[1.03] hover:shadow-emerald-200" title="Book Package" aria-label={`Book ${p.name}`}>
                        Book Package
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {visiblePackages.length < filtered.length && (
              <div className="text-center mt-8">
                <Button
                  onClick={() => setShowAll(true)}
                  className="h-12 px-6 rounded-xl text-base font-semibold bg-[#00A86B] text-white hover:bg-[#1B7F56] shadow-sm shadow-emerald-200/60"
                >
                  View All Health Packages
                </Button>
              </div>
            )}
            <div className="mt-12 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Not sure which health package is right for you?</h3>
              <p className="text-sm text-slate-600 max-w-2xl mx-auto">
                Our team will help you choose the right test based on age, symptoms, and budget.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button className="h-11 px-5 rounded-xl font-semibold bg-[#00A86B] text-white hover:bg-[#1B7F56]">
                  WhatsApp Us
                </Button>
                <Button className="h-11 px-5 rounded-xl font-semibold border border-[#E63946] text-[#E63946] hover:bg-red-50">
                  Call Now
                </Button>
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HealthPackages;
