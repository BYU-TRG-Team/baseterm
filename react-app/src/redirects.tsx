import { Navigate } from 'react-router-dom';

export const unverifiedRedirect = <Navigate to={{ pathname: '/pending-approval' }} />;
export const nonAuthenticatedRedirect = <Navigate to={{ pathname: '/login' }} />;