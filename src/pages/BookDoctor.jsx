
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Star, Filter, Stethoscope, Clock, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BookingDetails from '@/components/BookingDetails';
import { toast } from '@/components/ui/use-toast';

const BookDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [viewState, setViewState] = useState('list'); // 'list', 'details', 'booking'
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [showMoreSpecialties, setShowMoreSpecialties] = useState(false);
  const { t } = useTranslation();

  // Primary specialties shown upfront; others stay accessible via dropdown
  const PRIMARY_SPECIALTIES = useMemo(() => ([
    'General Physician',
    'Pediatrics',
    'Gynecology',
    'Orthopedics',
    'Psychiatry'
  ]), []);

  // Predefined list keeps ordering consistent and feeds the "More" menu
  const PREDEFINED_SPECIALTIES = useMemo(() => ([
    ...PRIMARY_SPECIALTIES,
    'Cardiology',
    'Dermatology',
    'ENT',
    'Neurology',
    'Nephrology',
    'Pulmonology',
    'Oncology',
    'Ophthalmology',
    'Dental'
  ]), [PRIMARY_SPECIALTIES]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase.from('doctors').select('*');
      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to load doctors", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Build groups by specialty based on current filter/search
  const normalizeSpecialty = (s) => (s || 'General Physician').trim();
  const activeDoctors = (searchTerm ? filteredDoctors : doctors);
  const specialtyGroups = useMemo(() => {
    const groups = {};
    activeDoctors.forEach((doc) => {
      const key = normalizeSpecialty(doc.specialty);
      if (!groups[key]) groups[key] = [];
      groups[key].push(doc);
    });
    return groups;
  }, [activeDoctors]);

  const allSpecialties = useMemo(() => {
    return Array.from(new Set([...
      PREDEFINED_SPECIALTIES,
      ...Object.keys(specialtyGroups)
    ]));
  }, [PREDEFINED_SPECIALTIES, specialtyGroups]);

  const secondarySpecialties = useMemo(() => (
    allSpecialties.filter(sp => !PRIMARY_SPECIALTIES.includes(sp))
  ), [allSpecialties, PRIMARY_SPECIALTIES]);

  const visibleChips = useMemo(() => {
    const chips = ['All', ...PRIMARY_SPECIALTIES];
    if (selectedSpecialty !== 'All' && !chips.includes(selectedSpecialty)) chips.push(selectedSpecialty);
    return chips;
  }, [PRIMARY_SPECIALTIES, selectedSpecialty]);

  const handleBookClick = (doctor) => {
    setSelectedDoctor(doctor);
    setViewState('booking');
    window.scrollTo(0, 0);
  };

  if (viewState === 'booking' && selectedDoctor) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50">
        <BookingDetails 
          type="doctor"
          items={[{ id: selectedDoctor.id, name: t('bookDoctor.booking.itemName', { name: selectedDoctor.doctor_name }), price: selectedDoctor.consultation_fee || 500 }]}
          totalAmount={selectedDoctor.consultation_fee || 500}
          onBack={() => setViewState('list')}
        />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Book Doctor Consultation - AASHA MEDIX</title></Helmet>
      <div className="pt-24 pb-28 min-h-screen bg-gray-50 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('bookDoctor.title')}</h1>
              <p className="text-gray-500">{t('bookDoctor.subtitle')}</p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder={t('bookDoctor.searchPlaceholder')} 
                className="pl-10 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {activeDoctors.length < 3 && !loading && (
                <p className="text-xs text-gray-500 mt-2">{t('bookDoctor.extras.moreComing', { defaultValue: 'More doctors joining soon. Tell us what you need.' })}</p>
              )}
            </div>
          </div>

          {/* Specialty tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-6 relative">
            {[t('bookDoctor.tabs.all'), ...visibleChips].map((spRaw) => {
              const sp = spRaw === t('bookDoctor.tabs.all') ? 'All' : spRaw;
              const count = sp === 'All' 
                ? (activeDoctors.length)
                : (specialtyGroups[sp]?.length || 0);
              return (
                <button
                  key={sp}
                  onClick={() => setSelectedSpecialty(sp)}
                  className={
                    `px-3 py-1 rounded-full border text-sm transition-colors ` +
                    (selectedSpecialty === sp 
                      ? 'bg-green-600 text-white border-green-600' 
                      : 'bg-white text-gray-700 hover:bg-green-50 border-gray-200')
                  }
                >
                  {sp === 'All' ? t('bookDoctor.tabs.all') : t(`specialties.${sp}`, { defaultValue: sp })}
                  <span className="ml-2 text-xs text-gray-500">{t('bookDoctor.countLabel', { count })}</span>
                </button>
              );
            })}

            {secondarySpecialties.length > 0 && (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMoreSpecialties(!showMoreSpecialties)}
                  className="px-3 py-1 h-9 text-sm border-gray-200 text-gray-700"
                >
                  More Specialties
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showMoreSpecialties ? 'rotate-180' : ''}`} />
                </Button>
                {showMoreSpecialties && (
                  <div className="absolute z-20 mt-2 w-64 bg-white border border-gray-100 rounded-lg shadow-lg p-2 max-h-64 overflow-auto">
                    {secondarySpecialties.map((sp) => (
                      <button
                        key={sp}
                        onClick={() => { setSelectedSpecialty(sp); setShowMoreSpecialties(false); }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between hover:bg-green-50 ${selectedSpecialty === sp ? 'bg-green-50 text-green-700' : 'text-gray-700'}`}
                      >
                        <span>{t(`specialties.${sp}`, { defaultValue: sp })}</span>
                        <span className="text-xs text-gray-500">{specialtyGroups[sp]?.length || 0}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>)}
            </div>
          ) : (activeDoctors.length === 0 ? (
            <div className="text-center py-20">
              <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('bookDoctor.noDoctors.title')}</h2>
              <p className="text-gray-500 mb-6">{t('bookDoctor.noDoctors.desc')}</p>
              <div className="flex gap-3 justify-center">
                <Button className="bg-green-600 hover:bg-green-700">
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    📱 {t('bookDoctor.labels.whatsapp')}
                  </a>
                </Button>
                <Button variant="outline">
                  <a href="tel:+919876543210" className="flex items-center gap-2">
                    ☎️ {t('bookDoctor.labels.callNow')}
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            (() => {
              const specialtiesToRender = selectedSpecialty === 'All'
                ? allSpecialties.filter(sp => (specialtyGroups[sp]?.length))
                : (specialtyGroups[selectedSpecialty]?.length ? [selectedSpecialty] : []);

              if (specialtiesToRender.length === 0) {
                return (
                  <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center bg-white">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>More specialists joining soon. Contact us for assisted scheduling.</span>
                    </div>
                    <div className="flex gap-3 justify-center mt-4">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          📱 {t('bookDoctor.labels.whatsapp')}
                        </a>
                      </Button>
                      <Button variant="outline">
                        <a href="tel:+919876543210" className="flex items-center gap-2">
                          ☎️ {t('bookDoctor.labels.callNow')}
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              }

              return specialtiesToRender.map((sp) => (
                <div key={sp} className="mb-10">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-gray-900">{sp === 'All' ? t('bookDoctor.tabs.all') : t(`specialties.${sp}`, { defaultValue: sp })}</h2>
                    <span className="text-sm text-gray-500">{t('bookDoctor.countLabel', { count: specialtyGroups[sp]?.length || 0 })}</span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {specialtyGroups[sp]?.map((doctor) => (
                      <Card key={doctor.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-0 shadow-md">
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl font-bold uppercase">
                              {doctor.doctor_name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-900">{doctor.doctor_name}</h3>
                              <p className="text-green-600 font-medium text-sm">{t(`specialties.${normalizeSpecialty(doctor.specialty)}`, { defaultValue: normalizeSpecialty(doctor.specialty) })}</p>
                              <p className="text-xs text-green-600 mt-1">Available today</p>
                              <p className="text-gray-500 text-xs mt-1">{doctor.qualification}</p>
                              <div className="flex items-center gap-1 mt-2">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs font-bold text-gray-700">4.8</span>
                                <span className="text-xs text-gray-400">{t('bookDoctor.extras.reviewsCount', { count: 120 })}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">{t('bookDoctor.labels.experience')}</p>
                              <p className="font-semibold text-sm">{doctor.experience || t('bookDoctor.extras.defaultExperienceYears')}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 mb-1">{t('bookDoctor.labels.fee')}</p>
                              <p className="font-bold text-green-600">₹{doctor.consultation_fee || 500}</p>
                            </div>
                          </div>
                          <div className="mt-6 flex gap-2">
                            <Button variant="outline" className="flex-1 text-xs">{t('bookDoctor.labels.viewProfile')}</Button>
                            <Button onClick={() => handleBookClick(doctor)} className="flex-1 bg-green-600 hover:bg-green-700 text-xs">{t('bookDoctor.labels.bookNow')}</Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ));
            })()
          ))}
        </div>
      </div>
    </>
  );
};

export default BookDoctor;
