import { Metadata } from 'next';
import AssetListPage from './home';

// add metadata for the page
export const metadata: Metadata = {
  title: 'Asset List',
  description: 'List of assets managed by the system',
};

export default function Page() {
  return <AssetListPage />;
}
