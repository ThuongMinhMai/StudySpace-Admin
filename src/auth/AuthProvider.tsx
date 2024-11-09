import studySpaceAPI from '@/lib/studySpaceAPI'
import { jwtDecode } from 'jwt-decode'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
interface AuthContextType {
  token: string | null
  user: User | null
  userDetail: IUserDetail | null
  loginSupplier: (username: string, password: string) => Promise<void>
  loginAdmin: (username: string, password: string) => Promise<void>
  logout: () => void
  fetchUser: () => void
  errorMessage: string | null
  loading: boolean
}

interface User {
  userID: number
  name: string
  email: string
  phone: string
  address: string
  gender: string | null
  roleName: string
  avaURL: string
  isPackaged: string
}
interface StoreWithPack {
  packageID: number
  packageName: string
  duration: number
  startDate: string
  endDate: string
}
interface IUserDetail {
  id: number
  thumbnailUrl: string
  longitude: number
  latitude: number
  description: string
  status: boolean
  isApproved: boolean
  isPackaged: boolean
  name: string
  email: string
  address: string
  phone: string
  createDate: string
  openTime: string
  closeTime: string
  isOverNight: boolean
  isActive: boolean
  taxNumber: string
  postalNumber: string
  storeWithPack: StoreWithPack
}
interface ApiResponse<T> {
  data: T
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token')
  })
  const [user, setUser] = useState<User | null>(null)
  const [userDetail, setUserDetail] = useState<IUserDetail | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUser()
  }, [token])
  const fetchUser = async () => {
    if (token) {
      try {
        // Decode the JWT to get user data
        const decodedToken: any = jwtDecode(token)
        const roleName = decodedToken.RoleName // Assuming your JWT has RoleName

        const result = {
          userID: decodedToken.nameid || 'Unknown',
          name: decodedToken.given_name || 'Unknown',
          email: decodedToken.email || 'Unknown',
          phone: decodedToken.PhoneNumber || 'Unknown',
          address: decodedToken.Address || 'Unknown',
          gender: decodedToken.Gender || 'unknown',
          roleName: decodedToken.RoleName || decodedToken.role,
          avaURL: decodedToken.Avatar || ''
        }
        // Fetch user detail based on role if needed
        let userDetailResponse
        let userDetail
        switch (result.roleName) {
          case 'Store':
            userDetailResponse = await studySpaceAPI.post('/Stores/token-decode', token)
            userDetail = await studySpaceAPI.get<ApiResponse<IUserDetail>>(`/Stores/detail/${result.userID}`)
            break
          case 'Admin':
            userDetailResponse = await studySpaceAPI.post('/Accounts/token-decode', token)
            userDetail = await studySpaceAPI.get<ApiResponse<IUserDetail>>(`/Accounts/detail/${result.userID}`)
            break
          // Add additional cases for other roles here
          default:
            console.warn(`No API endpoint defined for role: ${roleName}`)
            return
        }
        setUser(userDetailResponse.data)
        setUserDetail(userDetail.data.data)
      } catch (error) {
        localStorage.removeItem('token')
        console.error('Error decoding token:', error)
        toast.error('Failed to fetch user information. Please login again.')
      }
    }
  }
  const fetchSupplierData = async (newToken: any) => {
    try {
      const response = await studySpaceAPI.post<User>('/Stores/token-decode', newToken)
      setUser(response.data)
      const responseDetail = await studySpaceAPI.get<ApiResponse<IUserDetail>>(`/Stores/detail/${response.data.userID}`)
      setUserDetail(responseDetail.data.data)
      if (response.data.roleName === 'Store' || response.data.roleName === 'Admin') {
        toast.success('Đăng nhập thành công')
        navigate(`/home/${response.data.roleName.toLowerCase()}`)
      } else {
        toast.error('Tài khoản không được phép đăng nhập vào hệ thống')
        localStorage.removeItem('token')
      }
    } catch (error) {
      localStorage.removeItem('token')
      console.error('Fetching user information failed:', error)
    }
  }

  // Function for fetching user data for Admin role
  const fetchAdminData = async (newToken: string) => {
    try {
      const response = await studySpaceAPI.post<User>('/Accounts/token-decode', newToken)
      setUser(response.data)
      const responseDetail = await studySpaceAPI.get<ApiResponse<IUserDetail>>(
        `/Accounts/detail/${response.data.userID}`
      )
      setUserDetail(responseDetail.data.data)
      if (response.data.roleName === 'Store' || response.data.roleName === 'Admin') {
        toast.success('Đăng nhập thành công')
        navigate(`/home/${response.data.roleName.toLowerCase()}`)
      } else {
        toast.error('Tài khoản không được phép đăng nhập vào hệ thống')
        localStorage.removeItem('token')
      }
    } catch (error) {
      localStorage.removeItem('token')
      console.error('Fetching user information failed:', error)
    }
  }

  const loginSupplier = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await studySpaceAPI.post('/Stores/login-authen', {
        email: email,
        password: password
      })
      const newToken = response.data.token.loginInformation.token
      setToken(newToken)
      localStorage.setItem('token', newToken)
      setErrorMessage(null)

      await fetchSupplierData(newToken)
    } catch (error) {
      setLoading(false)
      toast.error('Email hoặc mật khẩu không đúng')
    } finally {
      setLoading(false)
    }
  }
  const loginAdmin = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await studySpaceAPI.post('/Accounts/login-authen', {
        email: email,
        password: password
      })
      const newToken = response.data.token.token
      setToken(newToken)
      localStorage.setItem('token', newToken)
      setErrorMessage(null)

      await fetchAdminData(newToken)
    } catch (error) {
      setLoading(false)
      toast.error('Email hoặc mật khẩu không đúng')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    toast.success('Đăng xuất thành công')
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <AuthContext.Provider
      value={{ token, user, userDetail, loginSupplier, loginAdmin, logout, fetchUser, errorMessage, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
