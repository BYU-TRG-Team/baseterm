import { Navigate } from 'react-router-dom';

export const unverifiedRedirect = <Navigate to={{ pathname: '/email-verification' }} />;
export const nonAuthenticatedRedirect = <Navigate to={{ pathname: '/login' }} />;