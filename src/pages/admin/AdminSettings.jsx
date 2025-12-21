
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layouts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AdminSettings = () => {
   const { user } = useAuth();
   const [loading, setLoading] = useState(false);
   const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
   const [profile, setProfile] = useState({ name: '', email: '' });

   useEffect(() => {
       if (user) {
           const fetchProfile = async () => {
               const { data } = await supabase.from('staff').select('*').eq('user_id', user.id).single();
               setProfile({ name: data?.name || '', email: user.email || '' });
           };
           fetchProfile();
       }
   }, [user]);

   const handlePasswordChange = async () => {
       if (passwordData.new !== passwordData.confirm) {
           toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
           return;
       }
       if (passwordData.new.length < 6) {
           toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
           return;
       }

       setLoading(true);
       const { error } = await supabase.auth.updateUser({ password: passwordData.new });
       
       if (error) {
           toast({ title: "Update Failed", description: error.message, variant: "destructive" });
       } else {
           toast({ title: "Success", description: "Password updated successfully" });
           setPasswordData({ current: '', new: '', confirm: '' });
       }
       setLoading(false);
   };

   return (
      <DashboardLayout title="Admin Settings">
         <div className="max-w-2xl space-y-6">
            <Card>
               <CardHeader><CardTitle>Profile Settings</CardTitle></CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Admin Name</label>
                        <Input value={profile.name} disabled className="bg-gray-50" />
                        <p className="text-xs text-gray-400">Name is managed in Staff Directory</p>
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input value={profile.email} disabled className="bg-gray-50" />
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader><CardTitle>Security</CardTitle></CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-sm font-medium">New Password</label>
                     <Input 
                        type="password" 
                        value={passwordData.new} 
                        onChange={e => setPasswordData({...passwordData, new: e.target.value})} 
                        placeholder="••••••••"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Confirm New Password</label>
                     <Input 
                        type="password" 
                        value={passwordData.confirm} 
                        onChange={e => setPasswordData({...passwordData, confirm: e.target.value})} 
                        placeholder="••••••••"
                     />
                  </div>
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50 mt-2"
                    onClick={handlePasswordChange}
                    disabled={loading || !passwordData.new}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Change Password"}
                  </Button>
               </CardContent>
            </Card>
         </div>
      </DashboardLayout>
   );
};

export default AdminSettings;
