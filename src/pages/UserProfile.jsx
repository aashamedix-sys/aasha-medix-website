
import React from 'react';
import PatientProfile from './patient/PatientProfile';
import { Helmet } from 'react-helmet';

// Reusing the robust PatientProfile component for the general /profile route
const UserProfile = () => {
  return (
    <>
       <Helmet><title>My Profile - AASHA MEDIX</title></Helmet>
       <div className="pt-24 bg-gray-50 min-h-screen pb-12">
          <PatientProfile />
       </div>
    </>
  );
};

export default UserProfile;
