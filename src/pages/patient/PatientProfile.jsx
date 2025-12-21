
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layouts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

const PatientProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    full_name: '', email: '', mobile: '', address: '', age: '', gender: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
        if (!user) return;
        const { data, error } = await supabase.from('patients').select('*').eq('user_id', user.id).single();
        if (data) setProfile(data);
        setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
        .from('patients')
        .update({
            full_name: profile.full_name,
            mobile: profile.mobile,
            address: profile.address,
            age: profile.age,
            gender: profile.gender
        })
        .eq('user_id', user.id);

    if (!error) {
        toast({ title: "Profile Updated", description: "Your details have been saved successfully." });
    } else {
        toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    }
    setSaving(false);
  };

  return (
    <DashboardLayout title="My Profile">
       <div className="max-w-2xl mx-auto">
         <Card className="shadow-lg border-0">
            <CardHeader className="bg-green-50 rounded-t-lg border-b border-green-100">
                <CardTitle className="text-xl text-green-800 flex items-center gap-2">
                    <User className="w-5 h-5" /> Personal Information
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                {loading ? <p>Loading profile...</p> : (
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1 block">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input name="full_name" value={profile.full_name || ''} onChange={handleChange} className="pl-9" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input name="email" value={profile.email || user?.email || ''} disabled className="pl-9 bg-gray-50 cursor-not-allowed" />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                             <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1 block">Mobile Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input name="mobile" value={profile.mobile || ''} onChange={handleChange} className="pl-9" />
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Age</label>
                                    <Input name="age" type="number" value={profile.age || ''} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Gender</label>
                                    <select 
                                        name="gender" 
                                        value={profile.gender || ''} 
                                        onChange={handleChange}
                                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input name="address" value={profile.address || ''} onChange={handleChange} className="pl-9" />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" disabled={saving} className="w-full md:w-auto bg-green-600 hover:bg-green-700">
                                {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                            </Button>
                        </div>
                    </form>
                )}
            </CardContent>
         </Card>
       </div>
    </DashboardLayout>
  );
};

export default PatientProfile;
