// components/ProtectedRoute.tsx
'use client'

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, accessToken, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!accessToken || !user) {
        router.push('/login');
        return;
      }

      if (allowedRoles && !allowedRoles.includes(user.role.toLowerCase())) {
        // Redirect to appropriate dashboard based on role
        redirectToRoleDashboard(user.role, router);
        return;
      }
    }
  }, [user, accessToken, isLoading, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!accessToken || !user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role.toLowerCase())) {
    return null;
  }

  return <>{children}</>;
};

export const redirectToRoleDashboard = (role: string, router: any) => {
  const roleRoutes: { [key: string]: string } = {
    'staff': '/staff/find-company',
    'supervisor': '/supervisor/dashboard',
    'vehicle_officer': '/vehicle-officer/dashboard',
    'corporate': '/corporate/dashboard',
    'ict_staff': '/ict/dashboard',
    'admin': '/admin/dashboard'
  };

  const route = roleRoutes[role.toLowerCase()] || '/staff/find-company';
  router.push(route);
};

export default ProtectedRoute;