
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Check, X, Loader2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import BookingDetails from '@/components/BookingDetails';

const BookDiagnosticTests = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const [allTests, setAllTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTests, setSelectedTests] = useState([]); 
  const [viewState, setViewState] = useState('selection'); // 'selection' or 'details'

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('tests').select('*').eq('is_active', true).order('name', { ascending: true });
      if (error) throw error;
      setAllTests(data || []);
      
      if (state?.preSelectedTest && data) {
        const found = data.find(t => t.name === state.preSelectedTest);
        if (found) toggleTestSelection(found);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
      toast({ title: "Error", description: "Failed to load tests.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(allTests.map(t => t.category));
    return ["All", ...Array.from(cats).sort()];
  }, [allTests]);

  const filteredTests = useMemo(() => {
    return allTests.filter(test => {
      const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) || (test.code && test.code.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === "All" || test.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allTests, searchQuery, activeCategory]);

  const toggleTestSelection = (test) => {
    setSelectedTests(prev => {
      const exists = prev.find(t => t.id === test.id);
      return exists ? prev.filter(t => t.id !== test.id) : [...prev, test];
    });
  };

  const calculateTotal = () => selectedTests.reduce((sum, item) => sum + Number(item.mrp), 0);

  const handleProceed = () => {
    if (selectedTests.length === 0) {
      toast({ title: "Select Tests", description: "Please select at least one test.", variant: "destructive" });
      return;
    }
    setViewState('details');
    window.scrollTo(0, 0);
  };

  if (viewState === 'details') {
    return (
      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-6">Booking Details</h1>
          <BookingDetails 
            type="test" 
            items={selectedTests} 
            totalAmount={calculateTotal()} 
            onBack={() => setViewState('selection')} 
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Book Tests - AASHA MEDIX</title></Helmet>
      <div className="min-h-screen bg-gray-50 pt-24 pb-32">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
             <div>
                <h1 className="text-3xl font-bold text-slate-900">Book Diagnostic Tests</h1>
                <p className="text-gray-500">Choose from {allTests.length}+ tests with free home collection</p>
             </div>
             <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                   placeholder="Search tests..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-10"
                />
             </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 w-full">
              {/* Categories Scroll */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-20 z-10 mb-6">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setActiveCategory(cat)} 
                      className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeCategory === cat ? 'bg-[#0FA958] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tests Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {loading ? (
                   <div className="col-span-2 text-center py-20">
                      <Loader2 className="w-10 h-10 text-green-500 animate-spin mx-auto" />
                   </div>
                ) : filteredTests.length === 0 ? (
                   <div className="col-span-2 text-center py-20 bg-white rounded-xl border border-dashed">
                      <p className="text-gray-500">No tests found matching your criteria.</p>
                   </div>
                ) : (
                  filteredTests.map(test => {
                    const isSelected = selectedTests.some(t => t.id === test.id);
                    return (
                      <div 
                        key={test.id} 
                        onClick={() => toggleTestSelection(test)} 
                        className={`bg-white p-5 rounded-xl border cursor-pointer transition-all hover:shadow-md relative ${
                          isSelected ? 'border-[#0FA958] ring-1 ring-[#0FA958] bg-green-50/10' : 'border-gray-100'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                           <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-1 rounded">{test.code}</span>
                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{test.category}</span>
                              </div>
                              <h3 className="font-bold text-slate-900 line-clamp-1">{test.name}</h3>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{test.description || `Sample: ${test.sample_type} • TAT: ${test.tat}`}</p>
                           </div>
                           <div className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center ml-3 ${isSelected ? 'bg-[#0FA958] border-transparent' : 'border-gray-300'}`}>
                              {isSelected && <Check className="w-4 h-4 text-white" />}
                           </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center border-t border-dashed pt-2">
                           <span className="text-xs text-green-700 font-medium">Home Collection Available</span>
                           <span className="font-bold text-[#0FA958] text-lg">₹{test.mrp}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Cart Sidebar */}
            <div className="hidden lg:block w-[350px] sticky top-24">
              <Card className="p-5 shadow-lg border-t-4 border-t-[#0FA958]">
                 <h3 className="font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" /> Order Summary
                 </h3>
                 <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {selectedTests.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                           <p className="text-sm">No tests selected</p>
                           <p className="text-xs mt-1">Select tests from the list to proceed</p>
                        </div>
                    ) : (
                        selectedTests.map((t, i) => (
                           <div key={i} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                              <span className="truncate w-40 font-medium">{t.name}</span>
                              <div className="flex items-center gap-2">
                                 <span className="font-bold">₹{t.mrp}</span>
                                 <button onClick={(e) => { e.stopPropagation(); toggleTestSelection(t); }} className="text-gray-400 hover:text-red-500">
                                    <X className="w-4 h-4" />
                                 </button>
                              </div>
                           </div>
                        ))
                    )}
                 </div>
                 
                 {selectedTests.length > 0 && (
                    <div className="pt-4 border-t mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span>₹{calculateTotal()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Home Collection</span>
                            <span className="text-green-600 font-medium">FREE</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                            <span>Total</span>
                            <span className="text-[#0FA958]">₹{calculateTotal()}</span>
                        </div>
                        <Button onClick={handleProceed} className="w-full bg-[#0FA958] hover:bg-green-700 text-white font-bold h-12 mt-4 shadow-lg shadow-green-200">
                           Proceed to Book
                        </Button>
                    </div>
                 )}
              </Card>
            </div>
            
            {/* Mobile Sticky Bottom Bar */}
            {selectedTests.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-50 shadow-[0_-5px_10px_rgba(0,0,0,0.1)]">
                    <div className="flex justify-between items-center max-w-7xl mx-auto">
                        <div>
                            <p className="text-xs text-gray-500">{selectedTests.length} Tests Selected</p>
                            <p className="font-bold text-lg text-[#0FA958]">₹{calculateTotal()}</p>
                        </div>
                        <Button onClick={handleProceed} className="bg-[#0FA958] hover:bg-green-700">
                            Proceed to Book
                        </Button>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDiagnosticTests;
