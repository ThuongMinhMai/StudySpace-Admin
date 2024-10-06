import React from 'react'
import { Navigate, RouteProps } from 'react-router-dom'
import { useAuth } from '@/auth/AuthProvider'

type ManagerProtectedRouteProps = RouteProps & {
  children: React.ReactNode
}

const ManagerProtectedRoute: React.FC<ManagerProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth()
  console.log('aut', user)
  if (!user) {
    // Redirect to login if user is not authenticated
    return <Navigate to='/' />
  }

  if (user.roleName !== 'Store') {
    // Redirect to not authorized page if user is not a manager or admin
    return <Navigate to='/not-authorized' />
  }

  return <>{children}</>
}

export default ManagerProtectedRoute
