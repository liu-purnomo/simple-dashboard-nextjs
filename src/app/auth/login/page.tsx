/* eslint-disable @next/next/no-img-element */

import { Metadata } from 'next';
import AuthLoginForm from './form';

export const metadata: Metadata = {
  title: 'Login',
};

const Login = () => {
  return (
    <div className="flex justify-center items-center">
      <AuthLoginForm />
    </div>
  );
};

export default Login;
