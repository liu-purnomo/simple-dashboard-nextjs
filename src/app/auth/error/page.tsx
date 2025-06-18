/* eslint-disable @next/next/no-img-element */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Login Error',
};

const LoginError = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 text-center px-4">
      <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
      <p className="text-muted-foreground max-w-md">
        You do not have permission to sign in because your email is not
        registered in our system.
      </p>
      <Link href="/auth/login">
        <button className="btn btn-outline-success">Try Again</button>
      </Link>
    </div>
  );
};

export default LoginError;
