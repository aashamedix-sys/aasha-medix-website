
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layouts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Eye, FileText, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import PDFViewer from '@/components/ui/PDFViewer';
import { Link } from 'react-router-dom';

const PatientReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingPdfUrl, setViewingPdfUrl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return;
      const { data: patientData } = await supabase.from('patients').select('id').eq('user_id', user.id).single();
      if (!patientData) {
        setLoading(false);
        return;
      }
      
      const { data } = await supabase
        .from('reports')
        .select('*')
        .eq('patient_id', patientData.id)
        .order('report_date', { ascending: false });

      if (data) setReports(data);
      setLoading(false);
    };

    fetchReports();
  }, [user]);

  const filteredReports = reports.filter(r => 
    r.test_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Medical Reports">
      {viewingPdfUrl && <PDFViewer url={viewingPdfUrl} onClose={() => setViewingPdfUrl(null)} />}
      
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Breadcrumb & Header */}
        <div>
          <nav className="flex items-center text-sm text-gray-500 mb-4">
             <Link to="/patient" className="hover:text-[#1FAA59]">Patient Portal</Link>
             <ChevronRight className="w-4 h-4 mx-2" />
             <span className="font-medium text-gray-900">My Reports</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h1 className="text-3xl font-bold text-slate-900">My Reports</h1>
               <p className="text-gray-500 mt-1">View, download, and print your test results.</p>
            </div>
            
             <div className="relative w-full md:w-72 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#1FAA59] transition-colors" />
              <Input 
                placeholder="Search test name..." 
                className="pl-10 h-11 bg-white border-gray-200 rounded-xl focus:ring-[#1FAA59] focus:border-[#1FAA59] shadow-sm transition-all" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Reports Table Card */}
        <Card className="border-0 shadow-lg overflow-hidden rounded-xl bg-white">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center">
                 <div className="w-8 h-8 border-4 border-[#1FAA59] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                 <p className="text-gray-500">Retrieving records...</p>
              </div>
            ) : (
              <>
                {/* Desktop Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-5 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                   <div className="col-span-4">Test Details</div>
                   <div className="col-span-3">Status</div>
                   <div className="col-span-3">Date</div>
                   <div className="col-span-2 text-right">Actions</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {filteredReports.length > 0 ? filteredReports.map((report) => (
                    <div key={report.id} className="group hover:bg-green-50/30 transition-colors p-5 md:grid md:grid-cols-12 md:gap-4 md:items-center">
                      
                      {/* Mobile Header */}
                      <div className="flex items-start justify-between md:hidden mb-4">
                         <div className="flex items-center gap-3">
                            <div className="bg-gray-100 p-2 rounded-lg text-gray-500">
                               <FileText className="w-5 h-5" />
                            </div>
                            <div>
                               <h3 className="font-bold text-slate-900">{report.test_name}</h3>
                               <p className="text-xs text-gray-500">{new Date(report.report_date).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${
                            report.status === 'Final' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                         }`}>
                           {report.status || 'Pending'}
                         </span>
                      </div>

                      {/* Desktop Columns */}
                      <div className="hidden md:block col-span-4">
                         <div className="flex items-center gap-3">
                            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
                               <FileText className="w-5 h-5" />
                            </div>
                            <div>
                               <h3 className="font-bold text-slate-900 group-hover:text-green-700 transition-colors">{report.test_name}</h3>
                               <p className="text-xs text-gray-500">ID: {report.id.substring(0,8)}</p>
                            </div>
                         </div>
                      </div>

                      <div className="hidden md:block col-span-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                            report.status === 'Final' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {report.status === 'Final' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {report.status || 'Processing'}
                          </span>
                      </div>

                      <div className="hidden md:block col-span-3 text-sm font-medium text-gray-600">
                          {new Date(report.report_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      
                      {/* Actions */}
                      <div className="col-span-2 flex items-center justify-end gap-2 mt-4 md:mt-0">
                        {report.pdf_url ? (
                          <>
                            <Button 
                                size="sm" 
                                className="h-9 bg-white text-green-700 border border-green-200 hover:bg-green-50 shadow-sm" 
                                onClick={() => setViewingPdfUrl(report.pdf_url)}
                            >
                                <Eye className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">View</span>
                            </Button>
                            <a href={report.pdf_url} download target="_blank" rel="noreferrer">
                                <Button size="sm" variant="ghost" className="h-9 w-9 p-0 text-gray-400 hover:text-green-700 hover:bg-green-50">
                                <Download className="w-4 h-4" />
                                </Button>
                            </a>
                          </>
                        ) : (
                             <span className="text-xs text-gray-400 italic flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Report Pending
                             </span>
                        )}
                      </div>
                    </div>
                  )) : (
                     <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                           <FileText className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No reports found</h3>
                        <p className="text-gray-500 max-w-sm mt-1">
                           {searchTerm ? `No results for "${searchTerm}"` : "Medical reports will appear here once your tests are completed."}
                        </p>
                        {!searchTerm && (
                            <Link to="/book-appointment">
                                <Button className="mt-6 bg-[#1FAA59] hover:bg-[#168a46]">Book a Lab Test</Button>
                            </Link>
                        )}
                     </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PatientReports;
