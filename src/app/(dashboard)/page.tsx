'use client';
import { signOut } from 'next-auth/react';
import { SummaryPage } from './summary/summary-page';

// Format date to 'YYYY-MM-DD'
const formatDate = (date: Date) => date.toISOString().split('T')[0];

export default function Page() {
  return (
    <>
      <SummaryPage />
      <div className="flex items-center justify-center panel">
        <div className="flex flex-col justify-center space-y-2 items-center">
          <button
            className="btn btn-outline-danger w-full "
            onClick={() => signOut()}
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}
