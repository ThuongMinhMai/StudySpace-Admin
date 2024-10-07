import React from 'react'
import { Navigate, RouteProps } from 'react-router-dom'
import { useAuth } from '@/auth/AuthProvider'

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
