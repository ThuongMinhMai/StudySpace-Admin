import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import studySpaceAPI from '@/lib/studySpaceAPI'
import { useAuth } from '@/auth/AuthProvider'
import ImageTab from './ImageTab'
import { ArrowLeft, Loader } from 'lucide-react'
import { Button } from '../atoms/ui/button'
import { Badge } from '../atoms/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../atoms/ui/select'
import { Dialog, DialogContent, DialogOverlay } from '../atoms/ui/dialog'
import { toast } from 'sonner'

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
  const [newStatus, setNewStatus] = useState<string>("") 
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
    console.log("change",status)
    setNewStatus(status) // Set the new status
    setDialogOpen(true) // Open the dialog
  }

  const confirmStatusChange = async () => {
    if (newStatus !== null && room) {
      try {
        await studySpaceAPI.put(`/Room/status/${id}`)
        setRoom({ ...room, status: newStatus==="active" ?true :false }) 
        toast.success("Cập nhật trạng thái phòng thành công");

      } catch (error) {
        toast.error("Lỗi cập nhật trạng thái phòng. Vui lòng thử lại sau!")
        setError('Failed to update room status')
      } finally {
        setDialogOpen(false) // Close the dialog after confirmation
      }
    }
  }
  useEffect(() => {
    fetchRoomData()
  }, [id])

  if (isLoading) return <div>Loading...</div>
  // if (error) return <div>{error}</div>
  if (!room) return <div>Room Not Found</div> // Display if room is null

  return (
    <div>
      <div className='flex justify-between'>
        <Button variant='ghost' onClick={handleGoBack}>
          <ArrowLeft className='w-8 h-8 text-primary' />
        </Button>
        <h1 className='text-3xl text-center text-primary font-medium'>{room?.roomName || 'No Data'}</h1>
        <Select onValueChange={handleStatusChange} value={room.status? "active":"inactive"}>
          <SelectTrigger className="w-48">
            <Badge 
              variant={room?.status !== undefined ? (room.status ? 'success' : 'destructive') : 'default'} 
            >
              {room?.status !== undefined ? (room.status ? 'Hoạt động' : 'Không hoạt động') : 'No Data'}
            </Badge>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">
              <Badge variant="success">Hoạt động</Badge>
            </SelectItem>
            <SelectItem value="inactive">
              <Badge variant="destructive">Không hoạt động</Badge>
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
          <p>No Images Available</p>
        )}
      </div>

      {/* Then display imageMenu */}
      <div>
        {room?.listImages.imageMenu ? (
          <img
            src={room.listImages.imageMenu}
            alt='Menu'
            style={{ width: '100%', maxWidth: '300px', margin: '10px' }}
          />
        ) : (
          <p>No Menu Image</p>
        )}
      </div>

      {/* Display room information */}
      <h2>Room Information:</h2>
      <p>
        <strong>Store Name:</strong> {room?.storeName || 'No Data'}
      </p>
      <p>
        <strong>Capacity:</strong> {room?.capacity || 'No Data'}
      </p>
      <p>
        <strong>Price Per Hour:</strong> {room?.pricePerHour !== undefined ? room.pricePerHour : 'No Data'}
      </p>
      <p>
        <strong>Description:</strong> {room?.description || 'No Data'}
      </p>

      <p>
        <strong>Type Space:</strong> {room?.typeSpace || 'No Data'}
      </p>
      <p>
        <strong>Type Room:</strong> {room?.typeRoom || 'No Data'}
      </p>
      <p>
        <strong>Area:</strong> {room?.area ? `${room.area} m²` : 'No Data'}
      </p>
      <p>
        <strong>Address:</strong> {room?.address || 'No Data'}
      </p>

      <h2>House Rules:</h2>
      <ul>
        {room?.houseRule.length > 0 ? (
          room.houseRule.map((rule, index) => <li key={index}>{rule}</li>)
        ) : (
          <li>No Data</li>
        )}
      </ul>

      <h2>Amities in Room:</h2>
      <ul>
        {room?.amitiesInRoom.length > 0 ? (
          room.amitiesInRoom.map((amity) => (
            <li key={amity.id}>
              {amity.name} ({amity.type}) - {amity.status ? 'Available' : 'Not Available'}, Quantity: {amity.quantity}
              <p>{amity.description || 'No Data'}</p>
            </li>
          ))
        ) : (
          <li>No Data</li>
        )}
      </ul>
     {dialogOpen && (
   
       <Dialog open={dialogOpen}  onOpenChange={setDialogOpen}>
       <DialogOverlay className='bg-/60' />
       <DialogContent>
         <h3 className='text-lg font-medium leading-6 text-gray-900'>Xác nhận thay đổi trạng thái</h3>
         <div className='mt-2'>
           <p>Bạn có chắc chắn muốn thay đổi trạng thái của phòng này?</p>
         </div>
         <div className='mt-4 flex justify-end space-x-2'>
           <Button variant='secondary'onClick={() => setDialogOpen(false)}>
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
