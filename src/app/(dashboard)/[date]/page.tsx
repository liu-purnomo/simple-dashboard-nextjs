import { Metadata } from 'next';
import { DailySummaryPage } from './summary';

export const metadata: Metadata = {
  title: 'Summary',
};

export default function Page({ params }: { params: { date: string } }) {
  return (
    <div>
      {params.date ? (
        <DailySummaryPage date={params.date} />
      ) : (
        <div>Masukkan Tanggal</div>
      )}
    </div>
  );
}
