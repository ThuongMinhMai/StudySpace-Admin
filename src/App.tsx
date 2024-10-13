import React, { Suspense, useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Loader from './components/global/molecules/Loader'
import Loading from './components/global/molecules/Loading'
import SignInForm from './components/global/organisms/SignInForm'
import ProtectedRoute from './auth/ProtectedRoute'
import NotAuthorized from './components/global/templates/NotAuthorized'
import AdminProtectedRoute from './auth/AdminProtectedRoute'
import ManagerProtectedRoute from './auth/ManagerProtectedRoute'
import { useAuth } from './auth/AuthProvider'
import NotFoundPage from './components/global/templates/NotFoundPage'
import ProfilePage from './components/global/templates/ProfilePage'
import Template from './components/global/templates/Template'
import RegisterPackage from './components/global/organisms/RegisterPackage'
import ProtectPackageRegister from './auth/ProtectPackageRegister'
import ProtectProfile from './auth/ProtectProfile'
import RoomStoreDetail from './components/global/organisms/RoomStoreDetail'
import CreateRoomStore from './components/global/organisms/CreateRoomStore'
const RouteLayout = React.lazy(() => import('./components/global/Layout/RouteLayout'))
const UsersPage = React.lazy(() => import('./components/global/templates/Users'))
const CompaniesPage = React.lazy(() => import('./components/global/templates/Companies'))
const SettingsPage = React.lazy(() => import('./components/global/templates/Settings'))
const Home = React.lazy(() => import('./components/global/templates/Dashboard'))
const StaffPage = React.lazy(() => import('./components/global/templates/Staffs'))
const TripPage = React.lazy(() => import('./components/global/templates/Trips'))
const RoomStore = React.lazy(() => import('./components/global/templates/RoomStore'))
const AmityStore = React.lazy(() => import('./components/global/templates/AmityStore'))
const BookingStore = React.lazy(() => import('./components/global/templates/BookingStore'))
const DashboardStore = React.lazy(() => import('./components/global/templates/DashboardStore'))
function App() {
  const [loading, setLoading] = useState<boolean>(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])
  // useEffect(() => {
  //   if (!loading && user) {
  //     if (user.RoleName === 'Admin') {
  //       navigate('/home/admin')
  //     } else if (user.RoleName === 'Manager') {
  //       navigate('/home/manager')
  //     }
  //   }
  // }, [loading, user, navigate])
  return loading ? (
    <div className='h-screen w-screen flex justify-center items-center'>
      <Loader />
    </div>
  ) : (
    <Routes>
      <Route element={<RouteLayout />}>
        <Route
          path='/home/admin'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>
                {/* <Home /> */}
              </Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/home/store'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>
                <DashboardStore />
              </Suspense>
            </ManagerProtectedRoute>
          }
        />

        <Route
          path='/stores'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>{/* <UsersPage /> */}</Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/allRooms'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>{/* <CompaniesPage /> */}</Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/bookingAll'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>{/* <SettingsPage /> */}</Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/accounts'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>{/* <SettingsPage /> */}</Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/roomStore'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>{ <RoomStore /> }</Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/roomStore/room-detail/:id'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>{ <RoomStoreDetail /> }</Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/roomStore/CreateNew'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>{ <CreateRoomStore /> }</Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/bookingStore'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}> <BookingStore /> </Suspense>
            </ManagerProtectedRoute>
          }
        />

        <Route
          path='/amities'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}> <AmityStore /> </Suspense>
            </ManagerProtectedRoute>
          }
        />
        {/* <Route
          path='/stations'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>
                <StationPage />
              </Suspense>
            </ManagerProtectedRoute>
          }
        /> */}
        {/* <Route
          path='/templates'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>
                <Template />
              </Suspense>
            </ManagerProtectedRoute>
          }
        /> */}
        <Route
          path='/profile'
          element={
            <ProtectProfile>
              <ProfilePage />
            </ProtectProfile>
          }
        />
      </Route>
      <Route
        path='/register-package'
        element={
          <ProtectPackageRegister>
            <RegisterPackage />
          </ProtectPackageRegister>
        }
      />
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <SignInForm />
          </ProtectedRoute>
        }
      />

      <Route path='/not-authorized' element={<NotAuthorized />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
