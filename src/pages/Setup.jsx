
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Database, Copy, Download, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';
import bcrypt from 'bcryptjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from '@/components/ui/use-toast';

const Setup = () => {
  const { signUp } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [credentials, setCredentials] = useState([]);

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  const usersToCreate = [
    // Admin
    { email: 'care@aashamedix.com', pass: 'Care@123456', role: 'admin', name: 'AASHA MEDIX Care Admin', type: 'admin' },
    // Staff
    { email: 'staff@aashamedix.com', pass: 'Staff@123456', role: 'staff', name: 'AASHA MEDIX Staff', type: 'staff' },
    // Additional staff for demo
    { email: 'staff1@aashamedix.com', pass: 'Staff@123456', role: 'lab', name: 'Ramesh Lab Tech', type: 'staff' },
    { email: 'staff2@aashamedix.com', pass: 'Staff@123456', role: 'phlebotomist', name: 'Suresh Phlebo', type: 'staff' },
    // Patients
    { email: 'patient1@aashamedix.com', pass: 'Patient@123456', role: 'patient', name: 'Rajesh Kumar', type: 'patient' },
    { email: 'patient2@aashamedix.com', pass: 'Patient@123456', role: 'patient', name: 'Priya Singh', type: 'patient' },
  ];

  useEffect(() => {
    checkIfInitialized();
  }, []);

  const checkIfInitialized = async () => {
    try {
      const { data } = await supabase.from('admin_users').select('id').limit(1);
      if (data && data.length > 0) {
        setSetupComplete(true);
        addLog("System already initialized. Admin user found.", 'warning');
      }
    } catch (e) {
      console.error("Check failed", e);
    }
  };

  const copyToClipboard = () => {
    const text = usersToCreate.map(u => `Email: ${u.email} | Pass: ${u.pass} | Role: ${u.role}`).join('\n');
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Credentials copied to clipboard!" });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("AASHA MEDIX - System Credentials", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    const tableData = usersToCreate.map(u => [u.email, u.pass, u.role, u.name]);
    
    doc.autoTable({
      head: [['Email', 'Password', 'Role', 'Name']],
      body: tableData,
      startY: 30,
    });

    doc.save("aasha-medix-credentials.pdf");
  };

  const runSetup = async () => {
    if (setupComplete) {
        if (!window.confirm("System appears to be already initialized. Re-running might cause duplicate errors. Continue?")) return;
    }

    setLoading(true);
    setLogs([]);
    addLog("Starting System Initialization...", 'info');

    try {
        const createdCreds = [];

        for (const user of usersToCreate) {
            addLog(`Processing user: ${user.email}...`, 'info');
            
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(user.pass, salt);

            // 1. Auth Sign Up
            let userId = null;
            const { data: authData, error: authError } = await signUp(user.email, user.pass);

            if (authError) {
                if (authError.message.includes('already registered') || authError.message.includes('unique constraint')) {
                    addLog(`User ${user.email} exists in Auth. Attempting to link...`, 'warning');
                    // Try to get ID by signing in
                    const { data: loginData } = await supabase.auth.signInWithPassword({ email: user.email, password: user.pass });
                    if (loginData?.user) {
                        userId = loginData.user.id;
                    } else {
                         addLog(`Could not login as ${user.email}. Email might not be confirmed yet.`, 'warning');
                    }
                } else {
                    addLog(`Failed to create auth user ${user.email}: ${authError.message}`, 'error');
                    continue;
                }
            } else if (authData?.user) {
                userId = authData.user.id;
                addLog(`Created Auth User: ${user.email}`, 'success');
            }

            // If we still don't have userId, we can't proceed with this user
            if (!userId) {
                addLog(`Skipping public table insert for ${user.email} - User ID missing. Run SQL migration to confirm emails.`, 'error');
                continue;
            }

            // 2. Insert into Public Tables
            let insertError = null;
            if (user.type === 'admin') {
                const { error } = await supabase.from('admin_users').upsert({
                    user_id: userId,
                    email: user.email,
                    password_hash: hash,
                    full_name: user.name,
                    role: user.role,
                    status: 'Active'
                }, { onConflict: 'email' });
                insertError = error;
            } else if (user.type === 'staff') {
                const { error } = await supabase.from('staff').upsert({
                    user_id: userId,
                    email: user.email,
                    password_hash: hash,
                    full_name: user.name,
                    role: user.role,
                    status: 'Active'
                }, { onConflict: 'email' });
                insertError = error;
            } else if (user.type === 'patient') {
                const { error } = await supabase.from('patients').upsert({
                    user_id: userId,
                    email: user.email,
                    password_hash: hash,
                    full_name: user.name,
                    created_at: new Date()
                }, { onConflict: 'email' });
                insertError = error;
            }

            if (insertError) {
                addLog(`Failed to link profile for ${user.email}: ${insertError.message}`, 'error');
            } else {
                addLog(`Linked profile for ${user.name}`, 'success');
                createdCreds.push(user);
            }
        }

        setCredentials(createdCreds);
        setSetupComplete(true);
        addLog("System Initialization Completed!", 'success');

    } catch (err) {
        addLog(`CRITICAL ERROR: ${err.message}`, 'error');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">System Setup & Initialization</h1>
                <p className="text-slate-500">Initialize database, create default users, and seed data.</p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/admin/login'}>
                Go to Admin Login
            </Button>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
             <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
             <div>
                 <h3 className="font-bold text-amber-800 text-sm">Important: Email Verification</h3>
                 <p className="text-sm text-amber-700 mt-1">
                     If you see "Email not confirmed" errors, please run the SQL migration provided by the assistant to manually confirm all emails.
                 </p>
             </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 h-fit">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        Actions
                    </CardTitle>
                    <CardDescription>Run setup tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button 
                        onClick={runSetup} 
                        disabled={loading} 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : 'Initialize System Users'}
                    </Button>

                    {credentials.length > 0 && (
                        <>
                            <div className="h-px bg-slate-200 my-4" />
                            <Button variant="outline" onClick={copyToClipboard} className="w-full">
                                <Copy className="w-4 h-4 mr-2" /> Copy Credentials
                            </Button>
                            <Button variant="outline" onClick={downloadPDF} className="w-full">
                                <Download className="w-4 h-4 mr-2" /> Download PDF
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="bg-slate-900 text-slate-200 border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-mono text-slate-400 uppercase tracking-wider">Execution Logs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 overflow-y-auto font-mono text-xs space-y-1 p-2">
                            {logs.length === 0 && <span className="text-slate-600">{/* Ready to initialize... */}</span>}
                            {logs.map((log, i) => (
                                <div key={i} className={`flex gap-2 ${
                                    log.type === 'error' ? 'text-red-400' : 
                                    log.type === 'warning' ? 'text-yellow-400' : 
                                    log.type === 'success' ? 'text-green-400' : 'text-slate-300'
                                }`}>
                                    <span className="opacity-40 shrink-0">[{log.time}]</span>
                                    <span>{log.msg}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;
