import React, { useState, useMemo } from 'react';
import { Search, Filter, ShoppingCart, ChevronDown, Award, Clock, Home, X, CheckCircle } from 'lucide-react';

export default function PriceList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedTests, setSelectedTests] = useState([]);

  const categories = [
    { id: 'all', name: 'All Tests', icon: '🔬', color: 'bg-blue-50' },
    { id: 'blood', name: 'Blood Tests', icon: '🩸', color: 'bg-red-50' },
    { id: 'biochemistry', name: 'Biochemistry', icon: '🧪', color: 'bg-purple-50' },
    { id: 'thyroid', name: 'Thyroid & Hormones', icon: '🧬', color: 'bg-indigo-50' },
    { id: 'nutrition', name: 'Nutrition & Deficiency', icon: '💊', color: 'bg-yellow-50' },
    { id: 'bone', name: 'Bone & Minerals', icon: '🦴', color: 'bg-orange-50' },
    { id: 'urine', name: 'Urinalysis', icon: '🔬', color: 'bg-green-50' },
    { id: 'immune', name: 'Immune & Infection', icon: '🦠', color: 'bg-pink-50' },
  ];

  const tests = [
    // Blood Tests
    { id: 1, name: 'Complete Blood Count (CBC)', price: 299, category: 'blood', sample: 'Blood', fasting: false },
    { id: 2, name: 'Hemoglobin Test', price: 150, category: 'blood', sample: 'Blood', fasting: false },
    { id: 3, name: 'Blood Group & RH Factor', price: 199, category: 'blood', sample: 'Blood', fasting: false },
    { id: 4, name: 'Peripheral Blood Smear (PBS)', price: 250, category: 'blood', sample: 'Blood', fasting: false },
    { id: 5, name: 'Reticulocyte Count', price: 350, category: 'blood', sample: 'Blood', fasting: false },
    { id: 6, name: 'Erythrocyte Sedimentation Rate (ESR)', price: 180, category: 'blood', sample: 'Blood', fasting: false },
    { id: 7, name: 'Prothrombin Time (PT/INR)', price: 299, category: 'blood', sample: 'Blood', fasting: false },
    { id: 8, name: 'APTT (Partial Thromboplastin Time)', price: 399, category: 'blood', sample: 'Blood', fasting: false },
    { id: 9, name: 'Bleeding Time & Clotting Time', price: 250, category: 'blood', sample: 'Blood', fasting: false },
    { id: 10, name: 'Blood Glucose (Fasting)', price: 180, category: 'blood', sample: 'Blood', fasting: true },
    // Biochemistry
    { id: 11, name: 'Fasting Blood Sugar (FBS)', price: 180, category: 'biochemistry', sample: 'Blood', fasting: true },
    { id: 12, name: 'Random Blood Sugar (RBS)', price: 150, category: 'biochemistry', sample: 'Blood', fasting: false },
    { id: 13, name: 'Post Prandial Blood Sugar (PPBS)', price: 180, category: 'biochemistry', sample: 'Blood', fasting: false },
    { id: 14, name: 'Liver Function Test (LFT)', price: 399, category: 'biochemistry', sample: 'Blood', fasting: false },
    { id: 15, name: 'Kidney Function Test (KFT)', price: 399, category: 'biochemistry', sample: 'Blood', fasting: false },
    { id: 16, name: 'Total Cholesterol', price: 249, category: 'biochemistry', sample: 'Blood', fasting: true },
    { id: 17, name: 'HDL Cholesterol', price: 249, category: 'biochemistry', sample: 'Blood', fasting: true },
    { id: 18, name: 'LDL Cholesterol', price: 249, category: 'biochemistry', sample: 'Blood', fasting: true },
    { id: 19, name: 'Triglycerides', price: 199, category: 'biochemistry', sample: 'Blood', fasting: true },
    { id: 20, name: 'Lipid Profile (Complete)', price: 449, category: 'biochemistry', sample: 'Blood', fasting: true },
    // Thyroid & Hormones
    { id: 21, name: 'TSH (Thyroid Stimulating Hormone)', price: 299, category: 'thyroid', sample: 'Blood', fasting: false },
    { id: 22, name: 'Free T3', price: 450, category: 'thyroid', sample: 'Blood', fasting: false },
    { id: 23, name: 'Free T4', price: 450, category: 'thyroid', sample: 'Blood', fasting: false },
    { id: 24, name: 'Total T3', price: 399, category: 'thyroid', sample: 'Blood', fasting: false },
    { id: 25, name: 'Total T4', price: 399, category: 'thyroid', sample: 'Blood', fasting: false },
    { id: 26, name: 'Anti TPO (Thyroid Peroxidase Antibody)', price: 499, category: 'thyroid', sample: 'Blood', fasting: false },
    // Nutrition & Deficiency
    { id: 27, name: 'Vitamin B12', price: 450, category: 'nutrition', sample: 'Blood', fasting: false },
    { id: 28, name: 'Vitamin D (25-OH)', price: 399, category: 'nutrition', sample: 'Blood', fasting: false },
    { id: 29, name: 'Folate Level', price: 399, category: 'nutrition', sample: 'Blood', fasting: false },
    { id: 30, name: 'Iron Studies (Serum Iron)', price: 399, category: 'nutrition', sample: 'Blood', fasting: true },
    { id: 31, name: 'TIBC (Total Iron Binding Capacity)', price: 399, category: 'nutrition', sample: 'Blood', fasting: true },
    { id: 32, name: 'Ferritin', price: 399, category: 'nutrition', sample: 'Blood', fasting: false },
    { id: 33, name: 'Serum Calcium', price: 199, category: 'nutrition', sample: 'Blood', fasting: false },
    { id: 34, name: 'Serum Magnesium', price: 299, category: 'nutrition', sample: 'Blood', fasting: false },
    { id: 35, name: 'Serum Phosphorus', price: 249, category: 'nutrition', sample: 'Blood', fasting: false },
    // Bone & Minerals
    { id: 36, name: 'Alkaline Phosphatase (ALP)', price: 199, category: 'bone', sample: 'Blood', fasting: false },
    { id: 37, name: 'Parathyroid Hormone (PTH)', price: 599, category: 'bone', sample: 'Blood', fasting: false },
    { id: 38, name: 'Bone Specific Alkaline Phosphatase', price: 649, category: 'bone', sample: 'Blood', fasting: false },
    // Urinalysis
    { id: 39, name: 'Routine Urine Test (Urinalysis)', price: 200, category: 'urine', sample: 'Urine', fasting: false },
    { id: 40, name: 'Urine Microalbumin', price: 299, category: 'urine', sample: 'Urine', fasting: false },
    { id: 41, name: 'Urine Creatinine', price: 299, category: 'urine', sample: 'Urine', fasting: false },
    { id: 42, name: 'Urine 24-Hour Protein', price: 349, category: 'urine', sample: 'Urine (24hr)', fasting: false },
    { id: 43, name: 'Serum Creatinine', price: 150, category: 'urine', sample: 'Blood', fasting: false },
    { id: 44, name: 'Blood Urea Nitrogen (BUN)', price: 150, category: 'urine', sample: 'Blood', fasting: false },
    // Immune & Infection
    { id: 45, name: 'Rheumatoid Factor (RF)', price: 399, category: 'immune', sample: 'Blood', fasting: false },
    { id: 46, name: 'C-Reactive Protein (CRP)', price: 299, category: 'immune', sample: 'Blood', fasting: false },
    { id: 47, name: 'Antinuclear Antibody (ANA)', price: 599, category: 'immune', sample: 'Blood', fasting: false },
    { id: 48, name: 'ESR (Erythrocyte Sedimentation Rate)', price: 180, category: 'immune', sample: 'Blood', fasting: false },
    { id: 49, name: 'Tuberculosis Gold Test (IGRA)', price: 1299, category: 'immune', sample: 'Blood', fasting: false },
    { id: 50, name: 'Lactate Dehydrogenase (LDH)', price: 249, category: 'immune', sample: 'Blood', fasting: false },
  ];

  // Filter and sort tests
  const filteredTests = useMemo(() => {
    let filtered = tests;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(test => test.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(test =>
        test.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [selectedCategory, searchTerm, sortBy]);

  const totalPrice = useMemo(() => {
    return selectedTests.reduce((sum, id) => {
      const test = tests.find(t => t.id === id);
      return sum + (test?.price || 0);
    }, 0);
  }, [selectedTests]);

  const toggleTest = (id) => {
    setSelectedTests(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F5F0] via-white to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Professional & Clear */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white border border-[#00A86B]/20 text-[#00A86B] px-4 py-2.5 rounded-full shadow-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00A86B] animate-pulse"></span>
            <span className="text-sm font-bold uppercase tracking-wide">Complete Diagnostic Tests</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F1F1F] mb-4">
            50+ Routine Examinations
          </h1>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
            Affordable, Accurate, and Accessible healthcare at your doorstep
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-soft flex items-center gap-3">
            <Award className="w-5 h-5 text-[#00A86B]" />
            <span className="text-sm font-semibold text-[#1F1F1F]">NABL Accredited</span>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-soft flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#00A86B]" />
            <span className="text-sm font-semibold text-[#1F1F1F]">24-Hour Reports</span>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-soft flex items-center gap-3">
            <Home className="w-5 h-5 text-[#00A86B]" />
            <span className="text-sm font-semibold text-[#1F1F1F]">Free Home Sample</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft sticky top-24">
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#1F1F1F] mb-2">Search Tests</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 w-4 h-4 text-[#6B7280]" />
                  <input
                    type="text"
                    placeholder="Type test name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-medical pl-10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-bold text-[#1F1F1F] mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#00A86B]" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                        selectedCategory === cat.id
                          ? 'bg-[#00A86B] text-white shadow-soft'
                          : 'bg-gray-50 text-[#1F1F1F] hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{cat.icon}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <h3 className="font-bold text-[#1F1F1F] mb-2">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-medical text-sm"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                </select>
              </div>

              {/* Cart Summary */}
              {selectedTests.length > 0 && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="font-bold text-[#1F1F1F] mb-4">Cart Summary</h3>
                  <div className="bg-[#E6F5F0] border border-[#00A86B]/20 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6B7280]">Tests Selected:</span>
                      <span className="font-bold text-[#00A86B]">{selectedTests.length}</span>
                    </div>
                    <div className="border-t border-[#00A86B]/20 pt-3">
                      <p className="text-xs text-[#6B7280] mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-[#00A86B]">
                        ₹{totalPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <button className="w-full bg-[#00A86B] hover:bg-[#1B7F56] text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-soft hover:shadow-medical flex items-center justify-center gap-2 mt-4">
                      <ShoppingCart className="w-4 h-4" />
                      Proceed to Checkout
                    </button>
                    <button
                      onClick={() => setSelectedTests([])}
                      className="w-full text-[#00A86B] hover:bg-gray-100 font-semibold py-2 rounded-lg transition-colors duration-200"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Tests Grid */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-soft flex justify-between items-center">
              <p className="text-sm text-[#6B7280]">
                Showing <span className="font-bold text-[#1F1F1F]">{filteredTests.length}</span> of <span className="font-bold text-[#1F1F1F]">{tests.length}</span> tests
              </p>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-[#E63946] hover:text-[#D62828] text-sm font-semibold transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Tests Grid - Premium Cards */}
            {filteredTests.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredTests.map(test => (
                  <div
                    key={test.id}
                    onClick={() => toggleTest(test.id)}
                    className={`card-premium cursor-pointer transition-all duration-300 ${
                      selectedTests.includes(test.id)
                        ? 'border-[#00A86B] bg-[#E6F5F0] shadow-medical'
                        : 'border-gray-200 hover:shadow-soft'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#1F1F1F] text-sm mb-2 leading-tight">
                          {test.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-medium text-[#6B7280] bg-gray-100 px-2.5 py-1 rounded-full">
                            {test.sample}
                          </span>
                          {test.fasting && (
                            <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                              Fasting Required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                        selectedTests.includes(test.id)
                          ? 'bg-[#00A86B] border-[#00A86B]'
                          : 'border-gray-300'
                      }`}>
                        {selectedTests.includes(test.id) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
                      <span className="text-xs text-[#6B7280] font-medium">Test Price</span>
                      <p className="text-lg font-bold text-[#00A86B]">
                        ₹{test.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <p className="text-[#6B7280] text-lg font-medium mb-4">No tests found matching your criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="text-[#00A86B] hover:text-[#1B7F56] font-bold transition-colors"
                >
                  Reset Filters & Browse All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Info Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="card-premium">
            <div className="flex items-start gap-3">
              <Award className="w-6 h-6 text-[#00A86B] shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-[#1F1F1F] mb-2">Quality Assured</h3>
                <p className="text-sm text-[#6B7280]">
                  NABL Accredited & ISO 15189 Certified Laboratory with the latest diagnostic technology
                </p>
              </div>
            </div>
          </div>
          <div className="card-premium">
            <div className="flex items-start gap-3">
              <Home className="w-6 h-6 text-[#00A86B] shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-[#1F1F1F] mb-2">Easy & Convenient</h3>
                <p className="text-sm text-[#6B7280]">
                  Book online or call us. Free home sample collection available for all tests
                </p>
              </div>
            </div>
          </div>
          <div className="card-premium">
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-[#00A86B] shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-[#1F1F1F] mb-2">Fast Results</h3>
                <p className="text-sm text-[#6B7280]">
                  Digital reports in 24 hours. Expert doctor consultation for abnormal results
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
