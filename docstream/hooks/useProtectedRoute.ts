// hooks/useProtectedRoute.ts
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export const useProtectedRoute = (requiredRole?: string) => {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (requiredRole && user?.role !== requiredRole) {
      router.push('/unauthorized')
      return
    }
  }, [isAuthenticated, user, requiredRole, router])

  return { isAuthenticated, user }
}