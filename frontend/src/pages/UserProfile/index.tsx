// src/pages/UserProfile/index.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SessionInfoPage from './SessionInfoPage';

const UserProfile: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="session" replace />} />
      <Route path="session" element={<SessionInfoPage />} />
    </Routes>
  );
};

export default UserProfile;