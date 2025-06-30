'use client';
import App from '@/app';
import store from '@/stores';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ReactNode, Suspense } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Loading } from './loading';

interface IProps {
  children?: ReactNode;
}

export const Provider = ({ children }: IProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  });

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ReduxProvider store={store}>
          <Suspense fallback={<Loading />}>
            <App>{children}</App>
          </Suspense>
        </ReduxProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};
