import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import studySpaceAPI from '@/lib/studySpaceAPI'
import { useAuth } from '@/auth/AuthProvider'
import ImageTab from './ImageTab'
import {
  ArrowLeft,
  CheckCircle,
  DollarSign,
  DoorClosed,
  Edit,
  Home,
  Info,
  Loader,
  MapIcon,
  MapPin,
  OctagonAlert,
  Pill,
  Rocket,
  Trash,
  Users,
  XCircle
} from 'lucide-react'
import { Button } from '../atoms/ui/button'
import { Badge } from '../atoms/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../atoms/ui/select'
import { Dialog, DialogContent, DialogOverlay } from '../atoms/ui/dialog'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/ui/table'

interface Amity {
  id: number
  name: string
  type: string
  status: boolean
  quantity: number
  description: string
}

interface ListImages {
  imageMenu: string | null
  imageList: string[]
}

interface Room {
  roomName: string
  storeName: string
  capacity: number
  pricePerHour: number
  description: string
  status: boolean
  typeSpace: string
  typeRoom: string
  area: number
  longitude: number
  latitude: number
  isOvernight: boolean
  startTime: string
  endTime: string
  houseRule: string[]
  listImages: ListImages
  address: string
  amitiesInRoom: Amity[]
}

interface ApiResponse<T> {
  data: T
}

const RoomStoreDetail: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>() // Get the room ID from the URL
  const [room, setRoom] = useState<Room | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [newStatus, setNewStatus] = useState<string>('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)

  const handleGoBack = () => {
    navigate(-1) // Navigate to the previous page
  }

  const fetchRoomData = async () => {
    try {
      const response = await studySpaceAPI.get<ApiResponse<Room>>(
        `Room/detail-by-store?roomId=${id}&storeId=${user?.userID}`
      )
      console.log('Room data:', response.data.data)
      setRoom(response.data.data)
    } catch (err) {
      setError('Failed to fetch room data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (status: string) => {
    console.log('change', status)
    setNewStatus(status) // Set the new status
    setDialogOpen(true) // Open the dialog
  }

  const confirmStatusChange = async () => {
    if (newStatus !== null && room) {
      try {
        await studySpaceAPI.put(`/Room/status/${id}`)
        setRoom({ ...room, status: newStatus === 'active' ? true : false })
        toast.success('Cập nhật trạng thái phòng thành công')
      } catch (error) {
        toast.error('Lỗi cập nhật trạng thái phòng. Vui lòng thử lại sau!')
        setError('Failed to update room status')
      } finally {
        setDialogOpen(false) // Close the dialog after confirmation
      }
    }
  }
  useEffect(() => {
    fetchRoomData()
  }, [id])

  if (isLoading) return <div>Đang tải...</div>
  // if (error) return <div>{error}</div>
  if (!room) return <div>Không tìm thấy phòng</div> // Display if room is null

  return (
    <div>
      <div className='flex justify-between'>
        <Button variant='ghost' onClick={handleGoBack}>
          <ArrowLeft className='w-8 h-8 text-primary' />
        </Button>
        <h1 className='text-3xl text-center text-primary font-medium'>{room?.roomName || 'No Data'}</h1>
        <Select onValueChange={handleStatusChange} value={room.status ? 'active' : 'inactive'}>
          <SelectTrigger className='w-48'>
            <Badge variant={room?.status !== undefined ? (room.status ? 'success' : 'destructive') : 'default'}>
              {room?.status !== undefined ? (room.status ? 'Hoạt động' : 'Không hoạt động') : 'No Data'}
            </Badge>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='active'>
              <Badge variant='success'>Hoạt động</Badge>
            </SelectItem>
            <SelectItem value='inactive'>
              <Badge variant='destructive'>Không hoạt động</Badge>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Display imageList first */}
      <div>
        {room?.listImages.imageList.length > 0 ? (
          // room.listImages.imageList.map((image, index) => (
          //   <img
          //     key={index}
          //     src={image}
          //     alt={`Room ${room.roomName} image ${index + 1}`}
          //     style={{ width: '100%', maxWidth: '300px', margin: '10px' }}
          //   />
          // ))
          <ImageTab roomPictureDetails={room.listImages.imageList} />
        ) : (
          <p>Không có ảnh cho phòng này</p>
        )}
      </div>

      {/* Then display imageMenu */}
      <div className='w-full'>
        {room?.listImages.imageMenu ? (
          <div>
            <p className='text-primary font-medium text-lg '>Menu</p>
            <img
              className='w-full rounded-md'
              src={
                room.listImages.imageMenu ||
                'https://kamereo.vn/blog/wp-content/uploads/2024/05/mau-menu-cafe-thumbnail.jpg'
              }
              alt='Menu'
            />
          </div>
        ) : (
          <p className='text-primary font-medium text-lg '>Menu: Chưa có ảnh menu</p>
        )}
      </div>

      <div>
        <div className='flex flex-col md:flex-row'>
          {/* Room Information Column */}
          <div className='md:w-1/2 p-4'>
            <h2 className='text-xl font-medium mb-2'>Thông tin phòng</h2>
            <table className='w-full table-auto border-collapse border border-gray-300'>
              <tbody>
                <tr className='border-b'>
                  <td className='p-2 flex items-center'>
                    <Home className='h-5 w-5 mr-2 text-gray-500' />
                    <p className='text-primary font-medium'>Tên cửa hàng:</p>
                  </td>
                  <td className='p-2'>{room?.storeName || 'No Data'}</td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2 flex items-center'>
                    <Users className='h-5 w-5 mr-2 text-gray-500' />
                    <p className='text-primary font-medium'>Sức chứa:</p>
                  </td>
                  <td className='p-2'>{room?.capacity || 'No Data'} (người)</td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2 flex items-center'>
                    <DollarSign className='h-5 w-5 mr-2 text-gray-500' />
                    <p className='text-primary font-medium'>Giá tiền/giờ:</p>
                  </td>
                  <td className='p-2'>{room?.pricePerHour !== undefined ? room.pricePerHour : 'No Data'}</td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2 flex items-center'>
                    <Pill className='h-5 w-5 mr-2 text-gray-500' />
                    <p className='text-primary font-medium'>Mô tả:</p>
                  </td>
                  <td className='p-2'>{room?.description || 'No Data'}</td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2 flex items-center'>
                    <Rocket className='h-5 w-5 mr-2 text-gray-500' />
                    <p className='text-primary font-medium'>Loại không gian:</p>
                  </td>
                  <td className='p-2'>{room?.typeSpace || 'No Data'}</td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2 flex items-center'>
                    <DoorClosed className='h-5 w-5 mr-2 text-gray-500' />
                    <p className='text-primary font-medium'>Loại phòng:</p>
                  </td>
                  <td className='p-2'>{room?.typeRoom || 'No Data'}</td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2 flex items-center'>
                    <Info className='h-5 w-5 mr-2 text-gray-500' />
                    <p className='text-primary font-medium'>Diện tích:</p>
                  </td>
                  <td className='p-2'>{room?.area ? `${room.area} m²` : 'No Data'}</td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2 flex items-center'>
                    <MapPin className='h-5 w-5 mr-2 text-gray-500' />
                    <p className='text-primary font-medium'>Địa chỉ:</p>
                  </td>
                  <td className='p-2'>{room?.address || 'No Data'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className='md:w-1/2 p-4'>
            <h2 className='text-xl font-semibold mb-2'>Quy tắc phòng:</h2>
            <table className='w-full table-auto border-collapse border border-gray-300 mb-4'>
              <tbody>
                {room?.houseRule.length > 0 ? (
                  room.houseRule.map((rule, index) => (
                    <tr key={index} className='border-b'>
                      <td className='p-2 flex items-center'>
                        <OctagonAlert className='h-5 w-5 mr-2 text-primary' /> {/* Adjust icon color as needed */}
                        {rule}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className='p-2'>No Data</td>
                  </tr>
                )}
              </tbody>
            </table>
            <h2 className='text-xl font-semibold mb-2'>Tiện ích trong phòng</h2>
            <Table className='w-full border border-gray-300'>
              <TableHeader>
                <TableRow className='bg-gray-100'>
                  {/* <TableHead className='p-2 text-left'>Status</TableHead> */}
                  <TableHead className='p-2 text-left'>Tiện ích</TableHead>
                  <TableHead className='p-2 text-left'>Số lượng</TableHead>
                  <TableHead className='p-2 text-left'>Mô tả</TableHead>
                  <TableHead className='p-2 text-left'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {room?.amitiesInRoom.length > 0 ? (
                  room.amitiesInRoom.map((amity) => (
                    <TableRow key={amity.id} className='border-b'>
                      {/* <TableCell className='p-2 flex items-center'>
                        {amity.status ? (
                          <CheckCircle className='h-5 w-5 mr-2 text-green-500' />
                        ) : (
                          <XCircle className='h-5 w-5 mr-2 text-red-500' />
                        )}
                      </TableCell> */}
                      <TableCell className='p-2'>
                        <span>
                          {amity.name} ({amity.type})
                        </span>
                      </TableCell>
                      <TableCell>{amity.quantity}</TableCell>
                      <TableCell>
                        <p className='text-gray-500'>{amity.description || 'Không có mô tả'}</p>
                      </TableCell>
                      <TableCell className='p-2 flex items-center'>
                        <Edit
                          className='h-5 w-5 text-blue-500 cursor-pointer mr-2'
                          onClick={() => handleEditAmity(amity.id)}
                        />
                        <Trash
                          className='h-5 w-5 text-red-500 cursor-pointer'
                          onClick={() => handleDeleteAmity(amity.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className='p-2' colSpan={3}>
                      No Data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {dialogOpen && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Xác nhận thay đổi trạng thái</h3>
            <div className='mt-2'>
              <p>Bạn có chắc chắn muốn thay đổi trạng thái của phòng này?</p>
            </div>
            <div className='mt-4 flex justify-end space-x-2'>
              <Button variant='secondary' onClick={() => setDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={confirmStatusChange} disabled={isLoadingUpdate}>
                {isLoadingUpdate ? <Loader className='animate-spin' /> : 'Xác nhận'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default RoomStoreDetail
