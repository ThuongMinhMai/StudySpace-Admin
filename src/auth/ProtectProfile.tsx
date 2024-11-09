import { useAuth } from '@/auth/AuthProvider'
import React from 'react'
import { Navigate, RouteProps } from 'react-router-dom'

type ProtectProfileProps = RouteProps & {
  children: React.ReactNode
}

const ProtectProfile: React.FC<ProtectProfileProps> = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to='/' />
  }

  return <>{children}</>
}

export default ProtectProfile
