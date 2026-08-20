import React from 'react';
import LogoSettingsPage from './crm/LogoSettingsPage';
import CRMLayout from '../components/crm/CRMLayout';

export default function BrandIdentity() {
  return (
    <CRMLayout title="Logo & Brand Identity | KnK Enterprise Settings">
      <LogoSettingsPage />
    </CRMLayout>
  );
}
