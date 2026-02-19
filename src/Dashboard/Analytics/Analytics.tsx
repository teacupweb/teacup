'use client';

import { useAuth } from '@/AuthProvider';
import { useAnalytics } from '@/backendProvider';
import AnalyticsClient from './AnalyticsClient';

export default function Analytics() {
  const { user } = useAuth();
  const companyId = user && typeof user !== 'string' ? user.companyId : null;
  
  // Fetch all analytics categories like dashboard does
  const { data: pageAnalytics, isLoading: pageLoading } = useAnalytics(companyId, 'page');
  const { data: formAnalytics, isLoading: formLoading } = useAnalytics(companyId, 'form');
  const { data: buttonAnalytics, isLoading: buttonLoading } = useAnalytics(companyId, 'button');

  return (
    <AnalyticsClient 
      companyId={companyId}
      pageAnalytics={pageAnalytics}
      formAnalytics={formAnalytics}
      buttonAnalytics={buttonAnalytics}
      isLoading={pageLoading || formLoading || buttonLoading}
    />
  );
}
