import { useAuth } from '@/auth/AuthProvider'
import { AddAmytiSchema, amitySchema } from '@/components/Schema/AmitySchema'
import studySpaceAPI from '@/lib/studySpaceAPI'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogTitle } from '@radix-ui/react-dialog'
import axios from 'axios'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../atoms/ui/button'
import { Dialog, DialogContent, DialogOverlay } from '../../atoms/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../atoms/ui/form'
import { Input } from '../../atoms/ui/input'
import { toast } from '../../atoms/ui/use-toast'
import { DataTable } from '../table/main'
import TableSkeleton from '../TableSkeleton'
import { columns } from './columns'
import { DataTableToolbar } from './toolbar'

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
  amityId: number
  amityName: string
  amityType: string
  amityStatus: string
  quantity: number
  description: string | null | undefined
}
interface ApiResponse<T> {
  data: T
}
interface Store {
  id: number
  name: string
  description: string
  email: string
  phone: string
  address: string
  openTime: string
  closeTime: string
  isOverNight: boolean
  status: string
  totalBookings: number
  totalTransactions: number
  totalBookingsInMonth: number
  totalTransactionsInMonth: number
  totalRooms: number
  starAverage: number
}
function ListAllStore() {
  const { user } = useAuth()
  const [amyties, setAmyties] = useState<Amyti[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [isLoadingStores, setIsLoadingStores] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [tempStatus, setTempStatus] = useState<{ [key: string]: string }>({})
  const [isEditing, setIsEditing] = useState<Store | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const handleShowServiceModal = (store: Store) => {
    // setSelectedStation(station)
    // setServiceModalVisible(true)
  }

  const formAmtiy = useForm<z.infer<typeof amitySchema>>({
    resolver: zodResolver(amitySchema),
    defaultValues: {
      amityName: '',
      type: '',
      quantity: 0,
      description: ''
    }
  })
  const formAddAmyti = useForm<z.infer<typeof AddAmytiSchema>>({
    resolver: zodResolver(AddAmytiSchema),
    defaultValues: {
      name: '',
      type: '',
      quantity: 0,
      description: ''
    }
  })
  useEffect(() => {
    const fetchAllStores = async () => {
      setIsLoadingStores(true)
      try {
        const response = await studySpaceAPI.get<ApiResponse<Store[]>>(`/Stores`)
        const result = response.data.data
        setStores(result || [])
        const initialStatuses: { [key: string]: string } = {}
        result.forEach((store) => {
          initialStatuses[store.id] = store.status
        })
        setTempStatus(initialStatuses)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingStores(false)
      }
    }

    fetchAllStores()
  }, [user?.userID])

  const handleStatusChange = (store: Store, status: string) => {
    setSelectedStore(store)
    setNewStatus(status)
    setIsModalOpen(true)
  }

  const confirmStatusChange = async () => {
    setIsLoadingUpdate(true)
    if (selectedStore) {
      try {
        await studySpaceAPI.put(`Stores/status/${selectedStore.id}`)
        setStores(stores.map((store) => (store.id === selectedStore.id ? { ...store, status: newStatus } : store)))
        setTempStatus({ ...tempStatus, [selectedStore.id]: newStatus })
        toast({
          variant: 'success',
          title: 'Cập nhật thành công',
          // description: 'Đã đổi trạng thái tiện ích này thành ' + newStatus
          description:
            newStatus === 'Active'
              ? 'Đã thay đổi trạng thái cửa hàng này thành hoạt động'
              : 'Đã thay đổi trạng thái cửa hàng này thành không hoạt động'
        })
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const message = error.response.data.Result.message
          setTempStatus({ ...tempStatus, [selectedStore.id]: selectedStore.status })
          toast({
            variant: 'destructive',
            title: 'Không thể cập nhật trạng thái cửa hàng',
            description: message || 'Vui lòng thử lại sau'
          })
        }
      } finally {
        setIsLoadingUpdate(false)
        setIsModalOpen(false)
      }
    }
  }

  const handleEditAmity = (store: Store) => {
    setIsEditing(store)
    // formAmtiy.reset()
    formAmtiy.reset({
      // amityName: amyti.amityName,
      // type: amyti.amityType,
      // quantity: amyti.quantity,
      // description: amyti.description || ''
    })
  }

  const confirmEditAmity = async (values: z.infer<typeof amitySchema>) => {}

  const handleModalAddClose = () => {
    setIsAdding(false)
    formAddAmyti.reset() // Reset form when closing
  }
  const confirmAddAmyti = async (values: z.infer<typeof AddAmytiSchema>) => {
    setIsLoadingUpdate(true)
    try {
      const response = await studySpaceAPI.post(`/Amity?supplierId=${user?.userID}`, {
        name: values.name,
        type: values.type,
        quantity: values.quantity,
        description: values.description
      })
      const result = response.data.data
      const newAmyti = {
        amityId: result.amityId,
        amityName: result.amityName,
        amityType: result.amityType,
        amityStatus: result.amityStatus,
        quantity: result.quantity,
        description: result.description
      }
      setAmyties([...amyties, newAmyti])
      toast({
        variant: 'success',
        title: 'Thêm tiện ích thành công',
        description: 'Tiện ích mới đã được thêm thành công'
      })
      setIsAdding(false)
      formAddAmyti.reset()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data.Result.message
        toast({
          variant: 'destructive',
          title: 'Không thể thêm tiện ích',
          description: message || 'Vui lòng thử lại sau'
        })
      }
    } finally {
      setIsLoadingUpdate(false)
    }
  }
  if (isLoadingStores) {
    return <TableSkeleton />
  }

  return (
    <div className='flex h-full flex-1 flex-col'>
      <div className='flex justify-between'>
        <h1 className='my-4 border-b pb-2 text-3xl font-semibold tracking-wider first:mt-0'>Danh sách cửa hàng</h1>
      </div>
      <DataTable
        data={stores}
        columns={columns(handleStatusChange, handleEditAmity, handleShowServiceModal)}
        Toolbar={DataTableToolbar}
        rowString='Cửa hàng'
      />
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Xác nhận thay đổi trạng thái</h3>
            <div className='mt-2'>
              <p>Bạn có chắc chắn muốn thay đổi trạng thái của cửa hàng này?</p>
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
      {isEditing && (
        <Dialog open={isEditing !== null} onOpenChange={() => setIsEditing(null)}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <DialogTitle>Cập nhật tiện ích</DialogTitle>
            <Form {...formAmtiy}>
              <form
                onSubmit={formAmtiy.handleSubmit(confirmEditAmity)}
                className='w-full flex gap-5 flex-col h-full text-center mr-20'
              >
                <FormField
                  control={formAmtiy.control}
                  name='amityName'
                  render={({ field }) => (
                    <FormItem className='w-full flex flex-col justify-center items-start'>
                      <FormLabel>Tên tiện ích</FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập tên tiện ích' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAmtiy.control}
                  name='type'
                  render={({ field }) => (
                    <FormItem className='w-full flex flex-col justify-center items-start'>
                      <FormLabel>Loại tiện ích</FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập loại tiện ích' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAmtiy.control}
                  name='quantity'
                  render={({ field }) => (
                    <FormItem className='w-full flex flex-col justify-center items-start'>
                      <FormLabel>Số lượng</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          {...field}
                          value={field.value || ''} // Ensures a controlled component
                          onChange={(e) => field.onChange(e.target.valueAsNumber)} // Converts string to number
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAmtiy.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem className='w-full flex flex-col justify-center items-start'>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập mô tả (tuỳ chọn)' {...field} />
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
      )}
      {isAdding && (
        <Dialog open={isAdding} onOpenChange={handleModalAddClose}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <DialogTitle>Thêm tiện ích mới</DialogTitle>
            <Form {...formAddAmyti}>
              <form
                onSubmit={formAddAmyti.handleSubmit(confirmAddAmyti)}
                className='w-full flex gap-5 flex-col h-full text-center mr-20'
              >
                <FormField
                  control={formAddAmyti.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='w-full flex flex-col justify-center items-start'>
                      <FormLabel>Tên tiện ích</FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập tên tiện ích' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAddAmyti.control}
                  name='type'
                  render={({ field }) => (
                    <FormItem className='w-full flex flex-col justify-center items-start'>
                      <FormLabel>Loại tiện ích</FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập loại tiện ích' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAddAmyti.control}
                  name='quantity'
                  render={({ field }) => (
                    <FormItem className='w-full flex flex-col justify-center items-start'>
                      <FormLabel>Số lượng</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Nhập số lượng'
                          type='number'
                          {...field}
                          value={field.value || ''} // Ensures a controlled component
                          onChange={(e) => field.onChange(e.target.valueAsNumber)} // Converts string to number
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAddAmyti.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem className='w-full flex flex-col justify-center items-start'>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập mô tả (tuỳ chọn)' {...field} />
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
    </div>
  )
}

export default ListAllStore
