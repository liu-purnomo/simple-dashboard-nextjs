import { Metadata } from 'next';
import TruckAssetDashboard from './dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function Page() {
  return <TruckAssetDashboard />;
}
