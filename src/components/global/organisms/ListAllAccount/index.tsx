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

 interface Amenity {
  id: number;
  name: string;
  type: string;
  status: boolean;
  quantity: number;
  description: string;
}

 interface Room {
  roomId: number;
  roomName: string;
  storeName: string;
  capacity: number;
  pricePerHour: number;
  description: string;
  status: boolean;
  area: number;
  type: string;
  image: string;
  address: string;
  amitiesInRoom: Amenity[];
}
interface ApiResponse<T> {
  data: T;
}

interface Account {
  id: number,
  roleName: string,
  name: string,
  email: string,
  phone:string,
  address: string,
  gender: string,
  dob: string,
  isActive: boolean,
  wallet: number,
  avatarUrl: string
}
function ListAllAccount() {
  const { user } = useAuth()
  const navigate = useNavigate();
  // const [stations, setStations] = useState<Station[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  // const [cities, setCities] = useState<City[]>([])
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [newStatus, setNewStatus] = useState<boolean>()
  const [tempStatus, setTempStatus] = useState<{ [key: string]: boolean }>({})
  const [isEditing, setIsEditing] = useState<Room | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  // const [isServiceModalVisible, setServiceModalVisible] = useState(false)
  const [isAmentiModalVisible, setAmentiModalVisible] = useState(false)
  const [isAddAmentiModalVisible, setAddAmentiModalVisible] = useState(false)
  // const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const handleUpdateAmenti = (updatedAmenti: any) => {
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
  const handleShowAmentiModal = (account: Account) => {
    // setSelectedRoom(room)
    // setAmentiModalVisible(true)
  }

  const handleShowAddServiceModal = () => {
    setAddAmentiModalVisible(true)
  }

  const handleAmentiModalOk = () => {
    setAmentiModalVisible(false)
  }

  const handleAddServiceModalOk = () => {
    // Handle the logic for adding a service
    setAddAmentiModalVisible(false)
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
    const fetchAllAccounts = async () => {
      setIsLoadingAccounts(true)
      try {
        const response = await studySpaceAPI.get<ApiResponse<Account[]>>(`/Accounts`)

        const result=response.data.data
        console.log("rome ne", result)
        setAccounts(result || [])
        const initialStatuses: { [key: string]: boolean } = {}
        result.forEach((account:Account) => {
          initialStatuses[account.id] = account.isActive
        })
        setTempStatus(initialStatuses)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingAccounts(false)
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
    fetchAllAccounts()
    // fetchCities()
  }, [user?.userID])

  const handleStatusChange = (account: Account, status: boolean) => {
    setSelectedAccount(account)
    setNewStatus(status)
    setIsModalOpen(true)
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
    setIsLoadingUpdate(true);
    if (selectedAccount) {
      try {
        console.log("nre sta", newStatus)
        // Ensure `newStatus` is correctly defined as a boolean before making the API call
        const statusToUpdate = newStatus !== undefined ? newStatus : selectedAccount.isActive; // Convert to boolean if necessary
  
        // Send the API request to update the status
        await studySpaceAPI.put(`/Accounts/status/${selectedAccount.id}`);
  
        // Update the rooms state
        setAccounts((prevAcc) =>
          prevAcc.map((acc) =>
            acc.id === selectedAccount.id ? { ...acc, isActive: statusToUpdate } : acc
          )
        );
  
        // Update temp status
        setTempStatus((prevTempStatus) => ({
          ...prevTempStatus,
          [selectedAccount.id]: statusToUpdate,
        }));
  
        // Display success toast notification
        toast({
          variant: 'success',
          title: 'Cập nhật thành công',
          description: 'Đã đổi trạng thái tài khoản này thành ' + (statusToUpdate ? 'Hoạt động' : 'Không hoạt động'),
        });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const message = error.response.data.Result.message || 'Vui lòng thử lại sau';
          // Reset the temporary status if there's an error
          setTempStatus((prevTempStatus) => ({
            ...prevTempStatus,
            [selectedAccount.id]: selectedAccount.isActive,
          }));
          // Display error toast notification
          toast({
            variant: 'destructive',
            title: 'Không thể cập nhật trạng thái tài khoản',
            description: message,
          });
        }
      } finally {
        setIsLoadingUpdate(false);
        setIsModalOpen(false);
      }
    }
  };
  const handleEditName = (account: Account, currentName: string) => {
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

  const handleAddStation = () => {
    setIsAdding(true)
  }
  const handleModalAddClose = () => {
    setIsAdding(false)
    // formAddStation.reset() 
  }
  // const confirmAddStation = async (values: z.infer<typeof AddStationSchema>) => {
  //   setIsLoadingUpdate(true)
  //   try {
  //     const { data } = await studySpaceAPI.post('station-management/managed-stations', {
  //       stationName: values.StationName,
  //       cityID: values.CityID,
  //       // companyID: user?.CompanyID
  //     })
  //     const newStation = { ...data, ServiceTypeInStation: [] }
  //     console.log('fjhhfjhkjg', newStation)
  //     setStations([...stations, newStation])
  //     toast({
  //       variant: 'success',
  //       title: 'Thêm trạm dừng thành công',
  //       description: 'Trạm dừng mới đã được thêm thành công'
  //     })
  //     setIsAdding(false)
  //     // formAddStation.reset()
  //   } catch (error) {
  //     if (axios.isAxiosError(error) && error.response) {
  //       const message = error.response.data.Result.message
  //       toast({
  //         variant: 'destructive',
  //         title: 'Không thể thêm trạm dừng',
  //         description: message || 'Vui lòng thử lại sau'
  //       })
  //     }
  //   } finally {
  //     setIsLoadingUpdate(false)
  //   }
  // }
  if (isLoadingAccounts) {
    return <TableSkeleton />
  }

  return (
    <div className='flex h-full flex-1 flex-col'>
      <div className='flex justify-between'>
        <h1 className='my-4 border-b pb-2 text-3xl font-semibold tracking-wider first:mt-0'>Danh sách tài khoản</h1>
        {/* <Button
          className='flex justify-center items-center bg-white border-primary border-[1px] text-primary hover:bg-primary hover:text-white'
          onClick={()=>navigate("/roomStore/CreateNew")}
        >
          <Plus className='w-6 mr-1' />
          Thêm phòng
        </Button> */}
      </div>
      <DataTable
        data={accounts}
        columns={columns(navigate,handleStatusChange, handleEditName, handleShowAmentiModal)}
        Toolbar={DataTableToolbar}
        rowString='Tài khoản'
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

export default ListAllAccount
