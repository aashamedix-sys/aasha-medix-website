
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Video, VideoOff, PhoneOff, FileText, Send, User } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const TelemedicineInterface = ({ appointment, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [notes, setNotes] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUploadPrescription = async () => {
    if (!prescriptionFile) return;
    
    // In a real app, upload to Supabase Storage
    toast({
        title: "Prescription Uploaded",
        description: `Prescription for ${appointment.patient_name} has been saved.`,
    });
    setPrescriptionFile(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col md:flex-row h-screen w-screen overflow-hidden">
        {/* Main Video Area */}
        <div className="flex-1 relative bg-black flex items-center justify-center">
             {/* Remote Stream Placeholder */}
             <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                <div className="text-center">
                    <User className="w-32 h-32 mx-auto text-gray-600 mb-4" />
                    <h2 className="text-2xl font-bold">{appointment.patient_name}</h2>
                    <p className="text-green-400 animate-pulse">Live Connection • {formatTime(callDuration)}</p>
                </div>
             </div>

             {/* Self View */}
             <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg border-2 border-gray-600 overflow-hidden shadow-xl">
                 <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    {isVideoOff ? <VideoOff className="w-8 h-8" /> : "Self View"}
                 </div>
             </div>

             {/* Call Controls */}
             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-800/80 p-4 rounded-full backdrop-blur-sm">
                <Button 
                    variant={isMuted ? "destructive" : "secondary"} 
                    size="icon" 
                    className="rounded-full w-12 h-12"
                    onClick={() => setIsMuted(!isMuted)}
                >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <Button 
                    variant={isVideoOff ? "destructive" : "secondary"} 
                    size="icon" 
                    className="rounded-full w-12 h-12"
                    onClick={() => setIsVideoOff(!isVideoOff)}
                >
                    {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </Button>
                <Button 
                    variant="destructive" 
                    size="icon" 
                    className="rounded-full w-14 h-14"
                    onClick={onEndCall}
                >
                    <PhoneOff className="w-6 h-6" />
                </Button>
             </div>
        </div>

        {/* Sidebar Panel */}
        <div className="w-full md:w-96 bg-white border-l border-gray-200 flex flex-col h-full">
            <div className="p-4 border-b bg-green-50">
                <h3 className="font-bold text-gray-900">Patient Information</h3>
                <p className="text-sm text-gray-600">ID: #{appointment.id.slice(0,8)}</p>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Name</span>
                        <span className="font-medium">{appointment.patient_name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Age/Gender</span>
                        <span className="font-medium">{appointment.patient_age} / {appointment.patient_gender}</span>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-md text-sm border border-yellow-100">
                        <strong className="block text-yellow-800 mb-1">Symptoms/Notes:</strong>
                        {appointment.notes || "No notes provided."}
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-600" /> Clinical Notes
                    </h4>
                    <textarea 
                        className="w-full p-2 border rounded-md text-sm min-h-[100px] focus:ring-2 focus:ring-green-500 outline-none"
                        placeholder="Type consultation notes here..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>

                <div className="border-t pt-4">
                     <h4 className="font-bold text-gray-900 mb-2">Upload Prescription</h4>
                     <Input 
                        type="file" 
                        accept=".pdf,.jpg,.png"
                        onChange={(e) => setPrescriptionFile(e.target.files[0])}
                        className="mb-2"
                     />
                     <Button 
                        onClick={handleUploadPrescription} 
                        disabled={!prescriptionFile}
                        className="w-full bg-green-600 hover:bg-green-700"
                    >
                        <Send className="w-4 h-4 mr-2" /> Send to Patient
                     </Button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default TelemedicineInterface;
