
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layouts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Save } from 'lucide-react';

const ContentManager = () => {
    const { toast } = useToast();
    const [heroContent, setHeroContent] = useState({ title: '', subtitle: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('content')
                .select('content')
                .eq('page', 'home')
                .eq('section', 'hero')
                .single();
            
            if (data) {
                setHeroContent(data.content);
            } else {
                console.error("Error fetching content:", error);
            }
            setLoading(false);
        };
        fetchContent();
    }, []);
    
    const handleSave = async () => {
        setLoading(true);
        const { error } = await supabase
            .from('content')
            .update({ content: heroContent, updated_at: new Date() })
            .eq('page', 'home')
            .eq('section', 'hero');

        if (error) {
            toast({ variant: 'destructive', title: 'Save Failed', description: error.message });
        } else {
            toast({ title: 'Success', description: 'Homepage content has been updated.' });
        }
        setLoading(false);
    };

    if (loading && !heroContent.title) {
        return <DashboardLayout title="Content Manager"><div>Loading content editor...</div></DashboardLayout>
    }

    return (
        <DashboardLayout title="Content Manager">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Website Content</h1>
                    <Button onClick={handleSave} disabled={loading}>
                       <Save className="w-4 h-4 mr-2" />
                       {loading ? 'Saving...' : 'Save All Changes'}
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Homepage Hero Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold">Main Title (supports HTML)</label>
                            <Textarea
                                value={heroContent.title}
                                onChange={(e) => setHeroContent(p => ({ ...p, title: e.target.value }))}
                                placeholder="Hero title..."
                                rows={3}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold">Subtitle</label>
                            <Input
                                value={heroContent.subtitle}
                                onChange={(e) => setHeroContent(p => ({ ...p, subtitle: e.target.value }))}
                                placeholder="Hero subtitle..."
                            />
                        </div>
                    </CardContent>
                </Card>

                 <Card className="opacity-50 cursor-not-allowed">
                    <CardHeader>
                        <CardTitle>Services Section (Coming Soon)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-500">Editing for services, testimonials, and blog posts will be enabled in a future update.</p>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default ContentManager;
