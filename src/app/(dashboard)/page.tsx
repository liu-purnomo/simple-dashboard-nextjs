'use client';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

// Format date to 'YYYY-MM-DD'
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

const todayFormatted = formatDate(today);
const yesterdayFormatted = formatDate(yesterday);

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center panel">
      <div className="flex flex-col justify-center space-y-2 items-center">
        <Link
          className="btn btn-outline-success  w-full"
          href={`/${todayFormatted}`}
        >
          Lihat Data Hari Ini
        </Link>

        <Link
          className="btn btn-outline-success  w-full"
          href={`/${yesterdayFormatted}`}
        >
          Lihat Data Tanggal {yesterdayFormatted}
        </Link>

        <button
          className="btn btn-outline-danger w-full "
          onClick={() => signOut()}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
