
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

  // Helper: wait between user creations to avoid rate limits
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Helper: Check if profile exists in DB
  const checkProfileExists = async (email, type) => {
    try {
      const table = type === 'admin' ? 'admin_users' : type === 'staff' ? 'staff' : 'patients';
      const { data, error } = await supabase.from(table).select('id, user_id').eq('email', email).single();
      return { exists: !!data && !error, userId: data?.user_id };
    } catch (e) {
      return { exists: false, userId: null };
    }
  };

  // Helper: Try to get user_id from auth.users by email lookup via sign-in attempt
  const getUserIdByEmail = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (data?.user?.id) {
        // Sign out immediately to avoid session conflicts
        await supabase.auth.signOut();
        return data.user.id;
      }
    } catch (e) {
      // Ignore errors
    }
    return null;
  };

  const runSetup = async () => {
    if (setupComplete) {
        if (!window.confirm("System already initialized. Re-run to sync missing users?")) return;
    }

    setLoading(true);
    setLogs([]);
    addLog("🚀 Starting System Initialization (Idempotent Mode)...", 'info');
    addLog("ℹ️  Existing users will be skipped, missing users will be created.", 'info');

    try {
        const createdCreds = [];
        let successCount = 0;
        let skipCount = 0;
        let failCount = 0;

        for (let i = 0; i < usersToCreate.length; i++) {
            const user = usersToCreate[i];
            addLog(`\n[${i + 1}/${usersToCreate.length}] Processing: ${user.email}`, 'info');
            
            // Step 1: Check if profile already exists
            const { exists, userId: existingUserId } = await checkProfileExists(user.email, user.type);
            if (exists && existingUserId) {
                addLog(`✓ Profile exists for ${user.email} (user_id: ${existingUserId.slice(0, 8)}...). Skipping.`, 'success');
                skipCount++;
                createdCreds.push(user); // Include in credentials list
                await delay(200); // Small delay before next user
                continue;
            }

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(user.pass, salt);

            // Step 2: Try to create or retrieve auth user
            let userId = null;

            // Try sign-up first
            const { data: authData, error: authError } = await signUp(user.email, user.pass);

            if (authError) {
                if (authError.message.toLowerCase().includes('rate limit')) {
                    addLog(`⚠️  Rate limit hit. Waiting 3 seconds...`, 'warning');
                    await delay(3000);
                    // Try to get user_id by sign-in if user already exists
                    userId = await getUserIdByEmail(user.email, user.pass);
                    if (!userId) {
                        addLog(`✗ Failed: ${user.email} - ${authError.message}`, 'error');
                        addLog(`   Suggestion: Wait 60 minutes or disable email confirmation in Supabase Auth settings.`, 'warning');
                        failCount++;
                        continue;
                    }
                } else if (authError.message.includes('already registered') || authError.message.includes('unique')) {
                    addLog(`⚠️  Auth user exists. Retrieving user_id...`, 'warning');
                    userId = await getUserIdByEmail(user.email, user.pass);
                    if (!userId) {
                        addLog(`✗ Could not retrieve user_id for ${user.email}. May need email confirmation.`, 'error');
                        failCount++;
                        continue;
                    }
                } else {
                    addLog(`✗ Auth error for ${user.email}: ${authError.message}`, 'error');
                    failCount++;
                    continue;
                }
            } else if (authData?.user) {
                userId = authData.user.id;
                addLog(`✓ Created auth user: ${user.email}`, 'success');
                // Sign out immediately to avoid conflicts
                await supabase.auth.signOut();
            }

            if (!userId) {
                addLog(`✗ No user_id obtained for ${user.email}. Skipping profile creation.`, 'error');
                failCount++;
                continue;
            }

            // Step 3: Insert into profile table (with safe column handling)
            let insertError = null;
            const baseProfile = {
                user_id: userId,
                email: user.email,
                password_hash: hash,
                full_name: user.name,
            };

            try {
                if (user.type === 'admin') {
                    const { error } = await supabase.from('admin_users').upsert({
                        ...baseProfile,
                        role: user.role,
                        status: 'Active'
                    }, { onConflict: 'user_id' });
                    insertError = error;
                } else if (user.type === 'staff') {
                    const { error } = await supabase.from('staff').upsert({
                        ...baseProfile,
                        role: user.role,
                        status: 'Active'
                    }, { onConflict: 'user_id' });
                    insertError = error;
                } else if (user.type === 'patient') {
                    // Try with onConflict first, fallback to direct insert
                    let result = await supabase.from('patients').upsert({
                        ...baseProfile,
                        created_at: new Date()
                    }, { onConflict: 'user_id' });
                    
                    if (result.error && result.error.message.includes('no unique or exclusion constraint')) {
                        // Fallback: try direct insert
                        result = await supabase.from('patients').insert({
                            ...baseProfile,
                            created_at: new Date()
                        });
                    }
                    insertError = result.error;
                }
            } catch (e) {
                insertError = e;
            }

            if (insertError) {
                addLog(`✗ Profile creation failed for ${user.email}: ${insertError.message}`, 'error');
                if (insertError.message.includes('column')) {
                    addLog(`   Schema mismatch detected. Check table structure.`, 'warning');
                }
                if (insertError.message.includes('foreign key') || insertError.message.includes('constraint')) {
                    addLog(`   FK constraint error. Verify auth.users entry exists.`, 'warning');
                }
                failCount++;
            } else {
                addLog(`✓ Profile linked: ${user.name} (${user.type})`, 'success');
                successCount++;
                createdCreds.push(user);
            }

            // Rate limit protection: wait between users
            if (i < usersToCreate.length - 1) {
                await delay(500); // 500ms between each user
            }
        }

        setCredentials(createdCreds);
        setSetupComplete(true);
        
        addLog(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'info');
        addLog(`📊 Setup Complete!`, 'success');
        addLog(`   ✓ Successful: ${successCount}`, 'success');
        addLog(`   ⊘ Skipped (existing): ${skipCount}`, 'warning');
        addLog(`   ✗ Failed: ${failCount}`, failCount > 0 ? 'error' : 'info');
        
        if (failCount > 0) {
            addLog(`\n💡 To fix failures:`, 'warning');
            addLog(`   1. Disable "Confirm email" in Supabase Auth settings`, 'warning');
            addLog(`   2. Run: ALTER TABLE admin_users/staff/patients DISABLE ROW LEVEL SECURITY;`, 'warning');
            addLog(`   3. Re-run setup (it's safe - existing users will be skipped)`, 'warning');
        }

    } catch (err) {
        addLog(`\n🔥 CRITICAL ERROR: ${err.message}`, 'error');
        console.error('Setup error:', err);
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
