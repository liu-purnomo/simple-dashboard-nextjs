import { Provider } from '@/layouts';
import { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../assets/styles/tailwind.css';

export const metadata: Metadata = {
  title: {
    template: '%s | MMS',
    default: 'Drone Indonesia',
  },
};

const nunito = Nunito({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={nunito.variable}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
