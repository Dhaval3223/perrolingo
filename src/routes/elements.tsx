import { Suspense, lazy, ElementType } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

export const LoginPage = Loadable(lazy(() => import('../pages/LoginPage')));

export const FlashCard = Loadable(lazy(() => import('../pages/FlashCard')));
export const Course = Loadable(lazy(() => import('../pages/Course')));
export const User = Loadable(lazy(() => import('../pages/User')));
export const ProposedCard = Loadable(lazy(() => import('../pages/ProposedCard')));

export const Page404 = Loadable(lazy(() => import('../pages/Page404')));
