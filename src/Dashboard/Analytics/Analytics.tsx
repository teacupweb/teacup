import { getAnalytics } from '@/lib/analytics';
import AnalyticsClient from './AnalyticsClient';

export default async function Analytics() {
  // You'll need to get companyId from auth context
  const analytics = await getAnalytics('1', 'page').catch(() => null);

  return <AnalyticsClient initialAnalytics={analytics} companyId="1" />;
}
