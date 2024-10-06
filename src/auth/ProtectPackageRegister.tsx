import React from 'react'
import { Navigate, RouteProps } from 'react-router-dom'
import { useAuth } from '@/auth/AuthProvider'

type ProtectPackageRegisterProps = RouteProps & {
  children: React.ReactNode
}

const ProtectPackageRegister: React.FC<ProtectPackageRegisterProps> = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to='/' />
  }

  // If the user already has a package, redirect to the store dashboard
  if (user && user.isPackaged ==="True") {
    return <Navigate to='/home/store' />
  }

  // Otherwise, allow access to the register package page
  return <>{children}</>
}

export default ProtectPackageRegister
