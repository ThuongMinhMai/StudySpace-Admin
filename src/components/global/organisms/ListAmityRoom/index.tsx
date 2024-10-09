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
import { amityNameSchema } from '@/components/Schema/StationNameSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AddStationSchema } from '@/components/Schema/AddStationSchema'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../atoms/ui/select'
import { ServiceModal } from '../ServiceModals'

// Define the interface for the Service
interface Service {
  Service_StationID: string
  ServiceID: string
  Price: number
  Name: string
  ImageUrl: string
}

// Define the interface for the ServiceType
interface ServiceType {
  ServiceTypeID: string
  ServiceTypeName: string
  ServiceInStation: Service[]
}

// Define the interface for the Station
interface Station {
  StationID: string
  CityID: string
  CityName: string
  StationName: string
  Status: string
  ServiceTypeInStation: ServiceType[]
}
interface City {
  CityID: string
  Name: string
  Status: string
}
interface Amyti {
  amityId: number;      
  amityName: string;   
  amityType: string;    
  amityStatus: string;  
  quantity: number;     
  description: string | null; 
}
interface ApiResponse<T> {
  data: T;
}
function ListAmityStore() {
  const { user } = useAuth()
  const [amyties, setAmyties] = useState<Amyti[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [isLoadingAmyties, setIsLoadingAmyties] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAmyti, setSelectedAmyti] = useState<Amyti | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [tempStatus, setTempStatus] = useState<{ [key: string]: string }>({})
  const [isEditing, setIsEditing] = useState<Amyti | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isServiceModalVisible, setServiceModalVisible] = useState(false)
  const [isAddServiceModalVisible, setAddServiceModalVisible] = useState(false)
  // const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  // const handleUpdateService = (updatedService: any) => {
  //   console.log("update ơ bang", updatedService)
  //   setStations((prevStations) =>
  //     prevStations.map((station) =>
  //       station.StationID === updatedService.StationID // Ensure you're matching with Service_StationID
  //         ? {
  //             ...updatedService
  //           }
  //         : station
  //     )
  //   )
  // }
  const handleShowServiceModal = (amyti: Amyti) => {
    // setSelectedStation(station)
    // setServiceModalVisible(true)
  }

  const handleShowAddServiceModal = () => {
    setAddServiceModalVisible(true)
  }

  const handleServiceModalOk = () => {
    setServiceModalVisible(false)
  }

  const handleAddServiceModalOk = () => {
    // Handle the logic for adding a service
    setAddServiceModalVisible(false)
  }
  const formAmtiy = useForm<z.infer<typeof amityNameSchema>>({
    resolver: zodResolver(amityNameSchema),
    defaultValues: {
      amityName: ''
    }
  })
  const formAddStation = useForm<z.infer<typeof AddStationSchema>>({
    resolver: zodResolver(AddStationSchema),
    defaultValues: {
      StationName: '',
      CityID: '',
      CompanyID: user?.email || '' //loi o day nhe
    }
  })
  useEffect(() => {
    const fetchAmyties = async () => {
      setIsLoadingAmyties(true)
      try {
        const response = await studySpaceAPI.get<ApiResponse<Amyti[]>>(`/Amity/supplier/${user?.userID}`)
        const result = response.data.data
        setAmyties(result || [])
        const initialStatuses: { [key: string]: string } = {}
        result.forEach((amyti) => {
          initialStatuses[amyti.amityId] = amyti.amityStatus
        })
        setTempStatus(initialStatuses)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingAmyties(false)
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
    fetchAmyties()
    // fetchCities()
  }, [user?.userID])

  const handleStatusChange = (amyti: Amyti, status: string) => {
    setSelectedAmyti(amyti)
    setNewStatus(status)
    setIsModalOpen(true)
  }

  const confirmStatusChange = async () => {
    setIsLoadingUpdate(true)
    if (selectedAmyti) {
      try {
        await studySpaceAPI.put(`Amity/status/${selectedAmyti.amityId}`)
        setAmyties(
          amyties.map((amyti) =>
            amyti.amityId === selectedAmyti.amityId ? { ...amyti, amityStatus: newStatus } : amyti
          )
        )
        setTempStatus({ ...tempStatus, [selectedAmyti.amityId]: newStatus })
        toast({
          variant: 'success',
          title: 'Cập nhật thành công',
          // description: 'Đã đổi trạng thái tiện ích này thành ' + newStatus
          description: newStatus === "Active"
          ? 'Đã thay đổi trạng thái tiện ích này thành hoạt động'
          : 'Đã thay đổi trạng thái tiện ích này thành không hoạt động'
        })
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const message = error.response.data.Result.message
          setTempStatus({ ...tempStatus, [selectedAmyti.amityId]: selectedAmyti.amityStatus })
          toast({
            variant: 'destructive',
            title: 'Không thể cập nhật trạng thái tiện ích',
            description: message || 'Vui lòng thử lại sau'
          })
        }
      } finally {
        setIsLoadingUpdate(false)
        setIsModalOpen(false)
      }
    }
  }

  const handleEditName = (amyti: Amyti, currentName: string) => {
    setIsEditing(amyti)
    formAmtiy.reset({ amityName: currentName })
  }

  const confirmEditName = async (values: z.infer<typeof amityNameSchema>) => {
    if (isEditing) {
      setIsLoadingUpdate(true)
      // try {
      //   await studySpaceAPI.put(`station-management/managed-stations/${isEditing.StationID}`, {
      //     StationName: values.StationName
      //   })
      //   setStations(
      //     stations.map((station) =>
      //       station.StationID === isEditing.StationID ? { ...station, StationName: values.StationName } : station
      //     )
      //   )
      //   toast({
      //     variant: 'success',
      //     title: 'Cập nhật thành công',
      //     description: 'Đã cập nhật tên trạm dừng'
      //   })
      //   setIsEditing(null)
      // } catch (error) {
      //   if (axios.isAxiosError(error) && error.response) {
      //     const message = error.response.data.Result.message
      //     toast({
      //       variant: 'destructive',
      //       title: 'Không thể cập nhật tên trạm dừng',
      //       description: message || 'Vui lòng thử lại sau'
      //     })
      //   }
      // } finally {
      //   setIsLoadingUpdate(false)
      // }
    }
  }

  const handleAddStation = () => {
    setIsAdding(true)
  }
  const handleModalAddClose = () => {
    setIsAdding(false)
    formAddStation.reset() // Reset form when closing
  }
  const confirmAddStation = async (values: z.infer<typeof AddStationSchema>) => {
    setIsLoadingUpdate(true)
    // try {
    //   const { data } = await studySpaceAPI.post('station-management/managed-stations', {
    //     stationName: values.StationName,
    //     cityID: values.CityID,
    //     companyID: user?.userID
    //   })
    //   const newStation = { ...data, ServiceTypeInStation: [] }
    //   console.log('fjhhfjhkjg', newStation)
    //   setStations([...stations, newStation])
    //   toast({
    //     variant: 'success',
    //     title: 'Thêm trạm dừng thành công',
    //     description: 'Trạm dừng mới đã được thêm thành công'
    //   })
    //   setIsAdding(false)
    //   formAddStation.reset()
    // } catch (error) {
    //   if (axios.isAxiosError(error) && error.response) {
    //     const message = error.response.data.Result.message
    //     toast({
    //       variant: 'destructive',
    //       title: 'Không thể thêm trạm dừng',
    //       description: message || 'Vui lòng thử lại sau'
    //     })
    //   }
    // } finally {
    //   setIsLoadingUpdate(false)
    // }
  }
  if (isLoadingAmyties) {
    return <TableSkeleton />
  }

  return (
    <div className='flex h-full flex-1 flex-col'>
      <div className='flex justify-between'>
        <h1 className='my-4 border-b pb-2 text-3xl font-semibold tracking-wider first:mt-0'>Danh sách tiện ích</h1>
        <Button
          className='flex justify-center items-center bg-white border-primary border-[1px] text-primary hover:bg-primary hover:text-white'
          onClick={handleAddStation}
        >
          <Plus className='w-6 mr-1' />
          Thêm tiện ích
        </Button>
      </div>
      <DataTable
        data={amyties}
        columns={columns(handleStatusChange, handleEditName, handleShowServiceModal)}
        Toolbar={DataTableToolbar}
        rowString='Tiện ích'
      />
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Xác nhận thay đổi trạng thái</h3>
            <div className='mt-2'>
              <p>Bạn có chắc chắn muốn thay đổi trạng thái của tiện ích này?</p>
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
      {isAdding && (
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
      )}
      {/* <ServiceModal
        visible={isServiceModalVisible}
        onOk={handleServiceModalOk}
        station={selectedStation}
        onAddService={handleShowAddServiceModal}
        onUpdateService={handleUpdateService} // Pass the update handler
      /> */}
      {/* <AddServiceModal visible={isAddServiceModalVisible} onOk={handleAddServiceModalOk} /> */}
    </div>
  )
}

export default ListAmityStore
