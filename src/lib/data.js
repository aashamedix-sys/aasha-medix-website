
// This file is no longer needed for primary data but can be kept for fallback or specific UI tests.
// The primary source of truth is now Supabase.

// Mock Data Management for AASHA MEDIX Ecosystem
// Uses localStorage to simulate a database for prototyping

const INITIAL_DATA = {
  patients: [
    { id: 'p1', name: 'Rajesh Kumar', age: 45, phone: '9876543210', bloodGroup: 'O+', history: 'Hypertension' }
  ],
  appointments: [
    { id: 'a1', patientId: 'p1', patientName: 'Rajesh Kumar', type: 'Home Collection', date: '2025-12-15', time: '09:00 AM', status: 'Scheduled', doctor: 'Dr. Anjali' },
    { id: 'a2', patientId: 'p1', patientName: 'Rajesh Kumar', type: 'Telemedicine', date: '2025-12-20', time: '04:00 PM', status: 'Pending', doctor: 'Dr. Priya' }
  ],
  reports: [
    { id: 'r1', patientId: 'p1', title: 'Complete Blood Count (CBC)', date: '2025-11-01', status: 'Available', file: '#' },
    { idr: 'r2', patientId: 'p1', title: 'Lipid Profile', date: '2025-11-01', status: 'Available', file: '#' }
  ],
  leads: [
    { id: 'l1', name: 'Suresh Goud', phone: '9988776655', location: 'Suryapet', interest: 'Full Body Checkup', status: 'New', notes: 'Called for inquiry' },
    { id: 'l2', name: 'Anita Reddy', phone: '8877665544', location: 'Kodad', interest: 'Diabetes Test', status: 'Follow-up', notes: 'Needs home collection' }
  ],
  staff: [
    { id: 's1', name: 'Ravi Verma', role: 'Phlebotomist', status: 'Active', location: 'Suryapet' },
    { id: 's2', name: 'Dr. Priya Singh', role: 'Doctor', status: 'Online', location: 'Remote' }
  ]
};

export const initializeData = () => {
  if (!localStorage.getItem('aasha_db')) {
    localStorage.setItem('aasha_db', JSON.stringify(INITIAL_DATA));
  }
};

export const getDb = () => {
  initializeData();
  return JSON.parse(localStorage.getItem('aasha_db'));
};

export const saveDb = (data) => {
  localStorage.setItem('aasha_db', JSON.stringify(data));
};

// Helper hooks
export const useData = (key) => {
  const db = getDb();
  return db[key] || [];
};
