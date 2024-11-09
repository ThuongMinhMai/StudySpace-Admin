import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth()
  const location = useLocation()
  if (user?.roleName === 'Admin' || user?.roleName === 'Store') {
    // If token exists, navigate back to the previous page or to the home page as a fallback
    return <Navigate to={location.state?.from || `/home/${user?.roleName === 'Admin' ? 'admin' : 'store'}`} replace />
  }
  return <>{children}</>
}

export default ProtectedRoute
