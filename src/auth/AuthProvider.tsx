import axios from 'axios'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import studySpaceAPI from '@/lib/studySpaceAPI'
import { toast } from 'sonner'
import { jwtDecode } from 'jwt-decode'
interface AuthContextType {
  token: string | null
  user: User | null
  userDetail: IUserDetail | null
  loginSupplier: (username: string, password: string) => Promise<void>
  loginAdmin: (username: string, password: string) => Promise<void>
  logout: () => void
  errorMessage: string | null
  loading: boolean
}

// interface User {
//   userID: number;
//   roleName: string;
//   phone: string;
//   name: string;
//   gender: string | null;
//   email: string;               // URL to the user's avatar
//   address: string;
// }
interface User {
  userID: number
  name: string
  email: string
  phone: string
  address: string
  gender: string | null
  roleName: string
  avaURL: string
}
interface IUserDetail {
  UserID: string
  UserName: string
  Password: string
  FullName: string
  Email: string
  Avatar: string
  Address: string
  OtpCode: string
  PhoneNumber: string
  Balance: number
  CreateDate: string
  IsVerified: boolean
  Status: string
  RoleID: string
  RoleName: string
  CompanyID: string
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

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     if (token) {
  //       try {
  //         const response = await studySpaceAPI.get<User>('/auth-management/managed-auths/token-verification', {
  //           headers: {
  //             Authorization: `Bearer ${token}`
  //           }
  //         })
  //         const userData = {
  //           ...response.data.Result.User,
  //           RoleName: response.data.Result.RoleName
  //         }
  //         setUser(userData)
  //       } catch (error) {
  //         localStorage.removeItem('token')
  //         console.error('Fetching user information failed:', error)
  //       }
  //     }
  //   }
  //   fetchUser()
  // }, [token])
  // Function for fetching user data for Supplier role

  // Decode user details from JWT
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          // Decode the JWT to get user data
          const decodedToken: any = jwtDecode(token)
          const roleName = decodedToken.RoleName // Assuming your JWT has RoleName
          console.log('ơ dat', decodedToken)

          const decodedTokens = jwtDecode(token)
          console.log(decodedTokens) // Check if roleName exists here
          const result = {
            userID: decodedToken.nameid || 'Unknown',
            name: decodedToken.given_name || 'Unknown',
            email: decodedToken.email || 'Unknown',
            phone: decodedToken.PhoneNumber || 'Unknown',
            address: decodedToken.Address || 'Unknown',
            gender: decodedToken.Gender || 'unknown',
            roleName: decodedToken.RoleName,
            avaURL: decodedToken.Avatar || ''
          }

          // Fetch user detail based on role if needed
          let userDetailResponse
          switch (result.roleName) {
            case 'Store':
              userDetailResponse = await studySpaceAPI.post('/Stores/token-decode', token)
              break
            case 'Admin':
              userDetailResponse = await studySpaceAPI.post('/Accounts/token-decode', token)
              break
            // Add additional cases for other roles here
            default:
              console.warn(`No API endpoint defined for role: ${roleName}`)
              return
          }
          console.log('hhe', userDetailResponse.data)
          setUser(userDetailResponse.data)
        } catch (error) {
          localStorage.removeItem('token')
          console.error('Error decoding token:', error)
          toast.error('Failed to fetch user information. Please login again.')
        }
      }
    }

    fetchUser()
  }, [token])
  const fetchSupplierData = async (newToken: any) => {
    try {
      const response = await studySpaceAPI.post<User>('/Stores/token-decode', newToken)
      console.log('nnee', response.data)
      setUser(response.data)
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
      console.log('nnee adminnnnn', response.data)
      setUser(response.data)
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
      console.log('login supplier', response.data.token.loginInformation.token)
      const newToken = response.data.token.loginInformation.token
      setToken(newToken)
      localStorage.setItem('token', newToken)
      setErrorMessage(null)

      await fetchSupplierData(newToken)
      console.log('sau')
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
      console.log('admin login', response.data.token.token)
      const newToken = response.data.token.token
      setToken(newToken)
      localStorage.setItem('token', newToken)
      setErrorMessage(null)

      // const fetchUser = async () => {
      //   try {
      //     const response = await studySpaceAPI.get<User>('/auth-management/managed-auths/token-verification', {
      //       headers: {
      //         Authorization: `Bearer ${newToken}`
      //       }
      //     })
      //     const userData = {
      //       ...response.data.Result.User,
      //       RoleName: response.data.Result.RoleName
      //     }
      //     setUser(userData)
      //     // console.log("User Data after login:", userData)
      //     // console.log("check",response.data.Result.RoleName)
      //     if (response.data.Result.RoleName === 'Manager' || response.data.Result.RoleName === 'Admin') {
      //       toast.success('Đăng nhập thành công')
      //       navigate(`/home/${response.data.Result.RoleName.toLowerCase()}`)
      //     } else {
      //       toast.error('Tài khoản không được phép đăng nhập vào hệ thống')
      //       localStorage.removeItem('token')
      //     }
      //   } catch (error) {
      //     toast.error('Lỗi đăng nhập. Vui lòng thử lại sau!')
      //     console.error('Fetching user information failed:', error)
      //   } finally {
      //     setLoading(false)
      //   }
      // }
      await fetchAdminData(newToken)
      // fetchUser()
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
    <AuthContext.Provider value={{ token, user, userDetail, loginSupplier, loginAdmin, logout, errorMessage, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
