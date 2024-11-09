import { useAuth } from '@/auth/AuthProvider'
import { RoomNameSchema } from '@/components/Schema/AmitySchema'
import studySpaceAPI from '@/lib/studySpaceAPI'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../../atoms/ui/button'
import { Dialog, DialogContent, DialogOverlay } from '../../atoms/ui/dialog'
import { toast } from '../../atoms/ui/use-toast'
import { ServiceModal } from '../ServiceModals'
import { DataTable } from '../table/main'
import TableSkeleton from '../TableSkeleton'
import { columns } from './columns'
import { DataTableToolbar } from './toolbar'

interface Amenity {
  id: number
  name: string
  type: string
  status: boolean
  quantity: number
  description: string
}

interface Room {
  roomId: number
  roomName: string
  storeName: string
  capacity: number
  pricePerHour: number
  description: string
  status: boolean
  area: number
  type: string
  image: string
  address: string
  amitiesInRoom: Amenity[]
}
interface ApiResponse<T> {
  data: T
}
function ListRoomStore() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoadingRooms, setIsLoadingRooms] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [newStatus, setNewStatus] = useState<boolean>()
  const [tempStatus, setTempStatus] = useState<{ [key: string]: boolean }>({})
  const [isEditing, setIsEditing] = useState<Room | null>(null)
  const [isAmentiModalVisible, setAmentiModalVisible] = useState(false)
  const [isAddAmentiModalVisible, setAddAmentiModalVisible] = useState(false)
  const handleUpdateAmenti = (updatedAmenti: any) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.roomId === updatedAmenti.StationID // Ensure you're matching with Service_StationID
          ? {
              ...updatedAmenti
            }
          : room
      )
    )
  }
  const handleShowAmentiModal = (room: Room) => {
    setSelectedRoom(room)
    setAmentiModalVisible(true)
  }

  const handleShowAddServiceModal = () => {
    setAddAmentiModalVisible(true)
  }

  const handleAmentiModalOk = () => {
    setAmentiModalVisible(false)
  }

  const formRoom = useForm<z.infer<typeof RoomNameSchema>>({
    resolver: zodResolver(RoomNameSchema),
    defaultValues: {
      roomName: ''
    }
  })

  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoadingRooms(true)
      try {
        const response = await studySpaceAPI.get<ApiResponse<Room[]>>(`/Room/supplier/${user?.userID}`)

        const result = response.data.data
        setRooms(result || [])
        const initialStatuses: { [key: string]: boolean } = {}
        result.forEach((room: Room) => {
          initialStatuses[room.roomId] = room.status
        })
        setTempStatus(initialStatuses)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingRooms(false)
      }
    }

    fetchRooms()
  }, [user?.userID])

  const handleStatusChange = (room: Room, status: boolean) => {
    setSelectedRoom(room)
    setNewStatus(status)
    setIsModalOpen(true)
  }

  const confirmStatusChange = async () => {
    setIsLoadingUpdate(true)
    if (selectedRoom) {
      try {
        // Ensure `newStatus` is correctly defined as a boolean before making the API call
        const statusToUpdate = newStatus !== undefined ? newStatus : selectedRoom.status // Convert to boolean if necessary

        // Send the API request to update the status
        await studySpaceAPI.put(`/Room/status/${selectedRoom.roomId}`)

        // Update the rooms state
        setRooms((prevRooms) =>
          prevRooms.map((room) => (room.roomId === selectedRoom.roomId ? { ...room, status: statusToUpdate } : room))
        )

        // Update temp status
        setTempStatus((prevTempStatus) => ({
          ...prevTempStatus,
          [selectedRoom.roomId]: statusToUpdate
        }))

        // Display success toast notification
        toast({
          variant: 'success',
          title: 'Cập nhật thành công',
          description: 'Đã đổi trạng thái phòng này thành ' + (statusToUpdate ? 'Hoạt động' : 'Không hoạt động')
        })
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const message = error.response.data.Result.message || 'Vui lòng thử lại sau'
          // Reset the temporary status if there's an error
          setTempStatus((prevTempStatus) => ({
            ...prevTempStatus,
            [selectedRoom.roomId]: selectedRoom.status
          }))
          // Display error toast notification
          toast({
            variant: 'destructive',
            title: 'Không thể cập nhật trạng thái phòng',
            description: message
          })
        }
      } finally {
        setIsLoadingUpdate(false)
        setIsModalOpen(false)
      }
    }
  }
  const handleEditName = (room: Room, currentName: string) => {
    setIsEditing(room)
    formRoom.reset({ roomName: currentName })
  }

  if (isLoadingRooms) {
    return <TableSkeleton />
  }

  return (
    <div className='flex h-full flex-1 flex-col'>
      <div className='flex justify-between'>
        <h1 className='my-4 border-b pb-2 text-3xl font-semibold tracking-wider first:mt-0'>Danh sách phòng</h1>
        <Button
          className='flex justify-center items-center bg-white border-primary border-[1px] text-primary hover:bg-primary hover:text-white'
          onClick={() => navigate('/roomStore/CreateNew')}
        >
          <Plus className='w-6 mr-1' />
          Thêm phòng
        </Button>
      </div>
      <DataTable
        data={rooms}
        columns={columns(navigate, handleStatusChange, handleEditName, handleShowAmentiModal)}
        Toolbar={DataTableToolbar}
        rowString='Phòng'
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

      <ServiceModal
        visible={isAmentiModalVisible}
        onOk={handleAmentiModalOk}
        room={selectedRoom}
        onAddAmenti={handleShowAddServiceModal}
        onUpdateAmenti={handleUpdateAmenti}
      />
    </div>
  )
}

export default ListRoomStore
