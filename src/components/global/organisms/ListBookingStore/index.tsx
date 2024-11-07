import { useEffect, useState } from 'react'
import { columns } from './columns'
import { DataTable } from '../table/main'
import { DataTableToolbar } from './toolbar'
import { useAuth } from '@/auth/AuthProvider'
import studySpaceAPI from '@/lib/studySpaceAPI'
import { toast } from '../../atoms/ui/use-toast'
import axios from 'axios'
import TableSkeleton from '../TableSkeleton'
import { Dialog, DialogContent, DialogOverlay } from '../../atoms/ui/dialog'
import { Button } from '../../atoms/ui/button'
import { Loader, Plus } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../atoms/ui/form'
import { Input } from '../../atoms/ui/input'
import { useForm } from 'react-hook-form'
import { RoomNameSchema } from '@/components/Schema/AmitySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AddStationSchema } from '@/components/Schema/AddStationSchema'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../atoms/ui/select'
import { ServiceModal } from '../ServiceModals'
import { useNavigate } from 'react-router-dom'
import { Modal, Tag } from 'antd'

// Define the interface for the Service
// interface Service {
//   Service_StationID: string
//   ServiceID: string
//   Price: number
//   Name: string
//   ImageUrl: string
// }

// // Define the interface for the ServiceType
// interface ServiceType {
//   ServiceTypeID: string
//   ServiceTypeName: string
//   ServiceInStation: Service[]
// }

// // Define the interface for the Station
// interface Station {
//   StationID: string
//   CityID: string
//   CityName: string
//   StationName: string
//   Status: string
//   ServiceTypeInStation: ServiceType[]
// }
// interface City {
//   CityID: string
//   Name: string
//   Status: string
// }

//  interface Amenity {
//   id: number;
//   name: string;
//   type: string;
//   status: boolean;
//   quantity: number;
//   description: string;
// }

//  interface Room {
//   roomId: number;
//   roomName: string;
//   storeName: string;
//   capacity: number;
//   pricePerHour: number;
//   description: string;
//   status: boolean;
//   area: number;
//   type: string;
//   image: string;
//   address: string;
//   amitiesInRoom: Amenity[];
// }

interface Booking {
  bookingId: number
  userName: string
  email: string
  userAddress: string
  gender: string // Consider using an enum for gender if there are specific values.
  avatar: string
  bookedDate: string // Consider using Date if you want to work with date objects.
  bookedTime: string // You might also consider using a Date object here.
  checkin: boolean
  roomId: number
  roomName: string
  storeName: string
  capacity: number
  pricePerHour: number
  description: string
  status: string // Consider using a union type for status.
  area: number
  roomType: 'BASIC' | 'PREMIUM' // Consider using a union type for room type.
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
  checkInDate:string
  checkOutDate:string
}
function ListBookingStore() {
  const { user } = useAuth()
  const navigate = useNavigate()
  // const [stations, setStations] = useState<Station[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  // const [cities, setCities] = useState<City[]>([])
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoadingBooking, setIsLoadingBooking] = useState(true)
  // const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [newStatus, setNewStatus] = useState<string>()
  const [tempStatus, setTempStatus] = useState<{ [key: number]: string }>({})
  const [isEditing, setIsEditing] = useState<Booking | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  // const [isServiceModalVisible, setServiceModalVisible] = useState(false)
  const [isTransactionModalVisible, setTransactionModalVisible] = useState(false)
  const [isAddTransactionModalVisible, setAddTransactionModalVisible] = useState(false)
  const [transactionData, setTransactionData] = useState<Transaction | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  // const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const handleUpdateTransactiob = (updatedAmenti: any) => {
    // console.log("update ơ bang", updatedAmenti)
    // setRooms((prevRooms) =>
    //   prevRooms.map((room) =>
    //     room.roomId === updatedAmenti.StationID // Ensure you're matching with Service_StationID
    //       ? {
    //           ...updatedAmenti
    //         }
    //       : room
    //   )
    // )
  }
  const handleShowAmentiModal = (booking: Booking) => {
    // setSelectedRoom(room)
    // setAmentiModalVisible(true)
  }

  const handleShowAddServiceModal = () => {
    // setAddAmentiModalVisible(true)
  }

  const handleAmentiModalOk = () => {
    // setAmentiModalVisible(false)
  }

  const handleAddServiceModalOk = () => {
    // Handle the logic for adding a service
    // setAddAmentiModalVisible(false)
  }
  const formRoom = useForm<z.infer<typeof RoomNameSchema>>({
    resolver: zodResolver(RoomNameSchema),
    defaultValues: {
      roomName: ''
    }
  })
  // const formAddStation = useForm<z.infer<typeof AddStationSchema>>({
  //   resolver: zodResolver(AddStationSchema),
  //   defaultValues: {
  //     StationName: '',
  //     CityID: '',
  //     CompanyID: user?.CompanyID || ''
  //   }
  // })
  useEffect(() => {
    const fetchBooking = async () => {
      setIsLoadingBooking(true)
      try {
        const response = await studySpaceAPI.get<ApiResponse<Booking[]>>(`/Room/booked/supplier/${user?.userID}`)

        const result = response.data.data
        console.log('rome ne', result)
        setBookings(result || [])
        // const initialStatuses: { [key: string]: boolean } = {}
        // result.forEach((booking:Booking) => {
        //   initialStatuses[booking.bookingId] = booking.status
        // })
        // setTempStatus(initialStatuses)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingBooking(false)
      }
    }
    // const fetchCities = async () => {
    //   try {
    //     const { data } = await studySpaceAPI.get<City[]>('city-management/managed-cities')
    //     setCities(data || [])
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    fetchBooking()
    // fetchCities()
  }, [user?.userID])

  const handleStatusChange = (booking: Booking, status: boolean) => {
    // setSelectedRoom(room)
    // setNewStatus(status)
    // setIsModalOpen(true)
  }

  // const confirmStatusChange = async () => {
  //   setIsLoadingUpdate(true)
  //   if (selectedRoom) {
  //     try {
  //       await studySpaceAPI.put(`status-management?entity=STATION&id=${selectedRoom.roomId}`)
  //       setRooms(
  //         rooms.map((room) =>
  //           room.roomId === selectedRoom.roomId ? { ...room, status: newStatus } : room
  //         )
  //       )
  //       setTempStatus({ ...tempStatus, [selectedRoom.roomId]: newStatus })
  //       toast({
  //         variant: 'success',
  //         title: 'Cập nhật thành công',
  //         description: 'Đã đổi trạng thái phòng này thành ' + newStatus
  //       })
  //     } catch (error) {
  //       if (axios.isAxiosError(error) && error.response) {
  //         const message = error.response.data.Result.message
  //         setTempStatus({ ...tempStatus, [selectedRoom.roomId]: selectedRoom.status })
  //         toast({
  //           variant: 'destructive',
  //           title: 'Không thể cập nhật trạng thái phòng',
  //           description: message || 'Vui lòng thử lại sau'
  //         })
  //       }
  //     } finally {
  //       setIsLoadingUpdate(false)
  //       setIsModalOpen(false)
  //     }
  //   }
  // }

  const confirmStatusChange = async () => {
    // setIsLoadingUpdate(true);
    // if (selectedRoom) {
    //   try {
    //     console.log("nre sta", newStatus)
    //     // Ensure `newStatus` is correctly defined as a boolean before making the API call
    //     const statusToUpdate = newStatus !== undefined ? newStatus : selectedRoom.status; // Convert to boolean if necessary
    //     // Send the API request to update the status
    //     await studySpaceAPI.put(`/Room/status/${selectedRoom.roomId}`);
    //     // Update the rooms state
    //     setRooms((prevRooms) =>
    //       prevRooms.map((room) =>
    //         room.roomId === selectedRoom.roomId ? { ...room, status: statusToUpdate } : room
    //       )
    //     );
    //     // Update temp status
    //     setTempStatus((prevTempStatus) => ({
    //       ...prevTempStatus,
    //       [selectedRoom.roomId]: statusToUpdate,
    //     }));
    //     // Display success toast notification
    //     toast({
    //       variant: 'success',
    //       title: 'Cập nhật thành công',
    //       description: 'Đã đổi trạng thái phòng này thành ' + (statusToUpdate ? 'Hoạt động' : 'Không hoạt động'),
    //     });
    //   } catch (error) {
    //     if (axios.isAxiosError(error) && error.response) {
    //       const message = error.response.data.Result.message || 'Vui lòng thử lại sau';
    //       // Reset the temporary status if there's an error
    //       setTempStatus((prevTempStatus) => ({
    //         ...prevTempStatus,
    //         [selectedRoom.roomId]: selectedRoom.status,
    //       }));
    //       // Display error toast notification
    //       toast({
    //         variant: 'destructive',
    //         title: 'Không thể cập nhật trạng thái phòng',
    //         description: message,
    //       });
    //     }
    //   } finally {
    //     setIsLoadingUpdate(false);
    //     setIsModalOpen(false);
    //   }
    // }
  }
  const handleEditName = (booking: Booking, currentName: string) => {
    // setIsEditing(room)
    // formRoom.reset({ roomName: currentName })
  }

  const confirmEditName = async (values: z.infer<typeof RoomNameSchema>) => {
    // if (isEditing) {
    //   setIsLoadingUpdate(true)
    //   try {
    //     await studySpaceAPI.put(`station-management/managed-stations/${isEditing.roomName}`, {
    //       roomName: values.roomName
    //     })
    //     setRooms(
    //       rooms.map((room) =>
    //         room.roomId === isEditing.roomId ? { ...room, roomName: values.roomName } : room
    //       )
    //     )
    //     toast({
    //       variant: 'success',
    //       title: 'Cập nhật thành công',
    //       description: 'Đã cập nhật tên trạm dừng'
    //     })
    //     setIsEditing(null)
    //   } catch (error) {
    //     if (axios.isAxiosError(error) && error.response) {
    //       const message = error.response.data.Result.message
    //       toast({
    //         variant: 'destructive',
    //         title: 'Không thể cập nhật tên trạm dừng',
    //         description: message || 'Vui lòng thử lại sau'
    //       })
    //     }
    //   } finally {
    //     setIsLoadingUpdate(false)
    //   }
    // }
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
  const handleAddStation = () => {
    setIsAdding(true)
  }
  const handleModalAddClose = () => {
    setIsAdding(false)
    // formAddStation.reset()
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
      {/* {isEditing && (
        <Dialog open={isEditing !== null} onOpenChange={() => setIsEditing(null)}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <Form {...formStation}>
              <form
                onSubmit={formStation.handleSubmit(confirmEditName)}
                className='w-full flex  gap-5 flex-col h-full text-center mr-20'
              >
                <h3 className='text-lg font-medium leading-6 text-gray-900'>Cập nhật tên trạm dừng</h3>
                <FormField
                  control={formStation.control}
                  name='StationName'
                  render={({ field }) => (
                    <FormItem className='w-full flex flex-col justify-center items-start'>
                      <FormLabel>Tên trạm dừng</FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập tên trạm dừng' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex gap-2 justify-end'>
                  <Button variant='outline' className='w-fit' onClick={() => setIsEditing(null)}>
                    Hủy
                  </Button>
                  <Button type='submit' disabled={isLoadingUpdate} className='w-fit'>
                    {isLoadingUpdate && <Loader className='animate-spin' />} Cập nhật
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )} */}
      {/* {isAdding && (
        <Dialog open={isAdding} onOpenChange={handleModalAddClose}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <Form {...formAddStation}>
              <form
                onSubmit={formAddStation.handleSubmit(confirmAddStation)}
                className='w-full flex gap-5 flex-col h-full text-center mr-20'
              >
                <h3 className='text-lg font-medium leading-6 text-gray-900'>Thêm trạm dừng mới</h3>
                <FormField
                  control={formAddStation.control}
                  name='CityID'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chọn thành phố</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn thành phố có trạm dừng chân' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.CityID} value={city.CityID}>
                              {city.Name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAddStation.control}
                  name='StationName'
                  render={({ field }) => (
                    <FormItem className='w-full flex flex-col justify-center items-start'>
                      <FormLabel>Tên trạm dừng</FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập tên trạm dừng' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex gap-2 justify-end'>
                  <Button variant='outline' className='w-fit' onClick={handleModalAddClose}>
                    Hủy
                  </Button>
                  <Button type='submit' disabled={isLoadingUpdate} className='w-fit'>
                    {isLoadingUpdate && <Loader className='animate-spin' />} Thêm
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )} */}
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
                <span className='font-medium'>Ngày đặt:</span> {new Date(transactionData.bookedDate).toLocaleDateString('vi-VN')}
              </p>
              <p className='text-gray-700'>
                <span className='font-medium'>Thời gian bắt đầu:</span> {transactionData.start}  ( {new Date(transactionData.checkInDate).toLocaleDateString('vi-VN')})
              </p>
              <p className='text-gray-700'>
                <span className='font-medium'>Thời gian kết thúc:</span> {transactionData.end} ( {new Date(transactionData.checkOutDate).toLocaleDateString('vi-VN')})
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
      {/* <ServiceModal
        visible={isAmentiModalVisible}
        onOk={handleAmentiModalOk}
        room={selectedRoom}
        onAddAmenti={handleShowAddServiceModal}
        onUpdateAmenti={handleUpdateAmenti} 
      />  */}
      {/* <AddServiceModal visible={isAddServiceModalVisible} onOk={handleAddServiceModalOk} />  */}
    </div>
  )
}

export default ListBookingStore
