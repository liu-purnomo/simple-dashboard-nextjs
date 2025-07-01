import { Metadata } from 'next';
import { DetailAsset } from './detail';

export const metadata: Metadata = {
  title: 'Summary',
};

export default function Page({ params }: { params: { unit: string } }) {
  return <div>{params.unit && <DetailAsset unit={params.unit} />}</div>;
}
