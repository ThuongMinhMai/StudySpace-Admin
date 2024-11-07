import React, { Suspense, useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Loader from './components/global/molecules/Loader'
import Loading from './components/global/molecules/Loading'
import SignInForm from './components/global/organisms/SignInForm'
import ProtectedRoute from './auth/ProtectedRoute'
import NotAuthorized from './components/global/templates/NotAuthorized'
import AdminProtectedRoute from './auth/AdminProtectedRoute'
import ManagerProtectedRoute from './auth/ManagerProtectedRoute'
import NotFoundPage from './components/global/templates/NotFoundPage'
import ProfilePage from './components/global/templates/ProfilePage'
import RegisterPackage from './components/global/organisms/RegisterPackage'
import ProtectPackageRegister from './auth/ProtectPackageRegister'
import ProtectProfile from './auth/ProtectProfile'
import RoomStoreDetail from './components/global/organisms/RoomStoreDetail'
import CreateRoomStore from './components/global/organisms/CreateRoomStore'
import TransactionStore from './components/global/templates/TransactionStore'
import PaymentSuccess from './components/global/templates/PaymentSuccess'
import PaymentFailure from './components/global/templates/PaymentFailure'
const RouteLayout = React.lazy(() => import('./components/global/Layout/RouteLayout'))
const Home = React.lazy(() => import('./components/global/templates/Dashboard'))
const AllBooking = React.lazy(() => import('./components/global/templates/AllBooking'))
const AllStore = React.lazy(() => import('./components/global/templates/AllStore'))
const AllTransaction = React.lazy(() => import('./components/global/templates/AllTransaction'))
const AllAccount= React.lazy(() => import('./components/global/templates/AllAccount'))
const RoomStore = React.lazy(() => import('./components/global/templates/RoomStore'))
const AllRoom = React.lazy(() => import('./components/global/templates/AllRoom'))
const AmityStore = React.lazy(() => import('./components/global/templates/AmityStore'))
const BookingStore = React.lazy(() => import('./components/global/templates/BookingStore'))
const DashboardStore = React.lazy(() => import('./components/global/templates/DashboardStore'))
function App() {
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])
 
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
                <Home />
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
              <Suspense fallback={<Loader />}> <AllStore /> </Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/allRooms'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>
                {' '}
                <AllRoom />{' '}
              </Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/bookingAll'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}> <AllBooking /></Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/transactionsAll'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}> <AllTransaction /> </Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/accounts'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}> <AllAccount /></Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/roomStore'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>{<RoomStore />}</Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/transactionStore'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>{<TransactionStore />}</Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/roomStore/room-detail/:id'
          element={
              <Suspense fallback={<Loader />}>{<RoomStoreDetail />}</Suspense>
          }
        />
        <Route
          path='/roomStore/CreateNew'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>{<CreateRoomStore />}</Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/bookingStore'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>
                {' '}
                <BookingStore />{' '}
              </Suspense>
            </ManagerProtectedRoute>
          }
        />

        <Route
          path='/amities'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>
                {' '}
                <AmityStore />{' '}
              </Suspense>
            </ManagerProtectedRoute>
          }
        />
      
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
  <Route path='/payment-success' element={<PaymentSuccess />} />
  <Route path='/payment-cancel' element={<PaymentFailure />} />
      <Route path='/not-authorized' element={<NotAuthorized />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
