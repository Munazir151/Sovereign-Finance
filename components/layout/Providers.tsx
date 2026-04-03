'use client';

import { ReactNode } from 'react';
import { DashboardProvider } from '@/lib/DashboardContext';
import ToastContainer from '@/components/ui/ToastContainer';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      {children}
      <ToastContainer />
    </DashboardProvider>
  );
}
