'use client';
import React, { useEffect, useState } from 'react';

import { Loading } from '@/layouts';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.replace('/');
    }

    if (session?.status === 'unauthenticated') {
      setLoading(false);
    }
  }, [session, router]);

  if (loading) return <Loading />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/assets/images/sky-day.webp')] bg-cover bg-center dark:bg-[url('/assets/images/sky-night.webp')]  dark:text-white-dark ">
      <div className="panel  my-10 w-full max-w-md bg-main/50 bg-opacity-60 p-3 shadow-md backdrop-blur-sm  ">
        <div className="flex flex-col justify-center rounded-md ">
          <div className=" bg-slate-100 dark:bg-slate-800">
            <div className="  m-6 ">
              <div className="panel-header">
                <div className="flex mb-5 MT-6 justify-center items-center">
                  <Image
                    src="/logo.png"
                    className="w-16 h-16"
                    alt="ADT"
                    width={150}
                    height={150}
                  />
                </div>
                <div className="flex justify-center text-info items-center">
                  <h2 className="font-bold text-2xl">MMS</h2>
                </div>
                <div className="flex mb-4 justify-center items-center">
                  <h2 className="font-bold ">MINING MANAGEMENT SYSTEMS</h2>
                </div>

                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
