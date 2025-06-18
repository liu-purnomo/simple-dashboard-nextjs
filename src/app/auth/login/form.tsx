'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

const AuthLoginForm = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn('google', {
        callbackUrl: '/',
      });
    } catch (error) {
      console.error('Sign-in failed:', error);
      setLoading(false);
    }
  };

  return (
    <button
      className="btn btn-outline-success"
      onClick={handleLogin}
      disabled={loading}
    >
      {loading ? 'Signing in...' : 'Sign in with Google 🚀'}
    </button>
  );
};

export default AuthLoginForm;
