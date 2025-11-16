// app/debug-auth/page.tsx
'use client'

import { useAuth } from '@/context/AuthContext';

export default function DebugAuth() {
  const { user, accessToken, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading auth...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Debug Info</h1>
      <div className="space-y-4">
        <div>
          <strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Has Token:</strong> {accessToken ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Token:</strong> {accessToken ? `${accessToken.substring(0, 20)}...` : 'None'}
        </div>
        <div>
          <strong>Has User:</strong> {user ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>User Data:</strong> {user ? JSON.stringify(user) : 'None'}
        </div>
        <div>
          <strong>LocalStorage Token:</strong> {localStorage.getItem('accessToken') ? 'Exists' : 'None'}
        </div>
        <div>
          <strong>LocalStorage User:</strong> {localStorage.getItem('user') ? 'Exists' : 'None'}
        </div>
      </div>
    </div>
  );
}