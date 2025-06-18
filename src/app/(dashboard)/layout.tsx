'use client';
import { Loading } from '@/layouts';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const session = useSession();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.replace('/auth/login');
    }

    if (session.status === 'authenticated') {
      setLoading(false);
    }
  }, [session, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading />;
      </div>
    );
  } else {
    return <div className="w-full text-black dark:text-white">{children}</div>;
  }
}
