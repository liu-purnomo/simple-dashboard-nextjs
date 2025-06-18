import { Metadata } from 'next';
import { SummaryPage } from './summary-page';

export const metadata: Metadata = {
  title: 'Analisa Data Produksi',
};

const Page = async () => {
  return <SummaryPage />;
};

export default Page;
