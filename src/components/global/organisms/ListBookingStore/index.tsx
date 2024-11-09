import { useAuth } from '@/auth/AuthProvider'
import studySpaceAPI from '@/lib/studySpaceAPI'
import { Modal, Tag } from 'antd'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../atoms/ui/button'
import { Dialog, DialogContent, DialogOverlay } from '../../atoms/ui/dialog'
import { DataTable } from '../table/main'
import TableSkeleton from '../TableSkeleton'
import { columns } from './columns'
import { DataTableToolbar } from './toolbar'

interface Booking {
  bookingId: number
  userName: string
  email: string
  userAddress: string
  gender: string
  avatar: string
  bookedDate: string
  bookedTime: string
  checkin: boolean
  roomId: number
  roomName: string
  storeName: string
  capacity: number
  pricePerHour: number
  description: string
  status: string
  area: number
  roomType: 'BASIC' | 'PREMIUM'
  spaceType: string
  image: string
  address: string
}
interface ApiResponse<T> {
  data: T
}

interface Transaction {
  userName: string
  email: string
  userAddress: string
  gender: 'XX' | 'XY'
  avatar: string
  roomName: string
  bookedDate: string
  start: string
  end: string
  fee: number
  paymentMethod: string
  status: string
  checkInDate: string
  checkOutDate: string
}
function ListBookingStore() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoadingBooking, setIsLoadingBooking] = useState(true)
  const [transactionData, setTransactionData] = useState<Transaction | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleShowAmentiModal = (booking: Booking) => {
    // setSelectedRoom(room)
    // setAmentiModalVisible(true)
  }

  useEffect(() => {
    const fetchBooking = async () => {
      setIsLoadingBooking(true)
      try {
        const response = await studySpaceAPI.get<ApiResponse<Booking[]>>(`/Room/booked/supplier/${user?.userID}`)

        const result = response.data.data
        setBookings(result || [])
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingBooking(false)
      }
    }

    fetchBooking()
  }, [user?.userID])

  const handleStatusChange = (booking: Booking, status: boolean) => {
    // setSelectedRoom(room)
    // setNewStatus(status)
    // setIsModalOpen(true)
  }

  const confirmStatusChange = async () => {}
  const handleEditName = (booking: Booking, currentName: string) => {
    // setIsEditing(room)
    // formRoom.reset({ roomName: currentName })
  }

  const fetchTransactionDetails = async (bookingId: number) => {
    try {
      const response = await studySpaceAPI.get<ApiResponse<Transaction>>(`/Transactions/booking-room/${bookingId}`) // Adjust the URL based on your API
      setTransactionData(response.data.data) // Set the fetched transaction data
      setIsModalVisible(true) // Show the modal
    } catch (error) {
      console.error('Error fetching transaction details:', error)
      // Handle error (e.g., show notification)
    }
  }

  const handleModalClose = () => {
    setIsModalVisible(false)
    setTransactionData(null) // Clear data when modal closes
  }
  if (isLoadingBooking) {
    return <TableSkeleton />
  }

  return (
    <div className='flex h-full flex-1 flex-col'>
      <div className='flex justify-between'>
        <h1 className='my-4 border-b pb-2 text-3xl font-semibold tracking-wider first:mt-0'>Danh sách đặt chỗ</h1>
      </div>
      <DataTable
        data={bookings}
        columns={columns(navigate, handleStatusChange, handleEditName, handleShowAmentiModal, fetchTransactionDetails)}
        Toolbar={DataTableToolbar}
        rowString='Đơn đặt'
      />
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Xác nhận thay đổi trạng thái</h3>
            <div className='mt-2'>
              <p>Bạn có chắc chắn muốn thay đổi trạng thái của phòng này?</p>
            </div>
            <div className='mt-4 flex justify-end space-x-2'>
              <Button variant='secondary' onClick={() => setIsModalOpen(false)}>
                Hủy
              </Button>
              <Button onClick={confirmStatusChange} disabled={isLoadingUpdate}>
                {isLoadingUpdate ? <Loader className='animate-spin' /> : 'Xác nhận'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Modal title='Chi tiết giao dịch' visible={isModalVisible} onCancel={handleModalClose} footer={null}>
        <div className='p-4'>
          <h3 className='text-xl font-semibold mb-4'>Thông tin giao dịch</h3>
          {transactionData ? (
            // If transactionData is available, display its details
            <div className='space-y-2'>
              <p className='text-gray-700'>
                <span className='font-medium'>Tên người dùng:</span> {transactionData.userName}
              </p>
              <p className='text-gray-700'>
                <span className='font-medium'>Email:</span> {transactionData.email}
              </p>
              <p className='text-gray-700'>
                <span className='font-medium'>Phòng:</span> {transactionData.roomName}
              </p>
              <p className='text-gray-700'>
                <span className='font-medium'>Ngày đặt:</span>{' '}
                {new Date(transactionData.bookedDate).toLocaleDateString('vi-VN')}
              </p>
              <p className='text-gray-700'>
                <span className='font-medium'>Thời gian bắt đầu:</span> {transactionData.start} ({' '}
                {new Date(transactionData.checkInDate).toLocaleDateString('vi-VN')})
              </p>
              <p className='text-gray-700'>
                <span className='font-medium'>Thời gian kết thúc:</span> {transactionData.end} ({' '}
                {new Date(transactionData.checkOutDate).toLocaleDateString('vi-VN')})
              </p>
              <p className='text-gray-700'>
                <span className='font-medium'>Phí:</span> {transactionData.fee.toLocaleString()} VND
              </p>
              <p className='text-gray-700'>
                <span className='font-medium'>Phương thức thanh toán:</span> {transactionData.paymentMethod}
              </p>

              <p className='text-gray-700'>
                <span className='font-medium'>Địa chỉ người dùng:</span> {transactionData.userAddress}
              </p>

              <p className='text-gray-700'>
                <span className='font-medium'>Status:</span>{' '}
                <Tag
                  color={
                    transactionData.status === 'PAID' ? 'green' : transactionData.status === 'CANCEL' ? 'red' : 'orange'
                  }
                >
                  {transactionData.status}
                </Tag>
              </p>
            </div>
          ) : (
            // If transactionData is not available, show "No transaction"
            <p className='text-center text-gray-500'>Không có giao dịch</p>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default ListBookingStore
