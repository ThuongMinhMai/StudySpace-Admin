import { useAuth } from '@/auth/AuthProvider'
import { AddAmytiSchema, amitySchema } from '@/components/Schema/AmitySchema'
import studySpaceAPI from '@/lib/studySpaceAPI'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../atoms/ui/button'
import { Dialog, DialogContent, DialogOverlay } from '../../atoms/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../atoms/ui/form'
import { Input } from '../../atoms/ui/input'
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

interface Transaction {
  id: number
  date: string
  paymentMethod: string
  status: string
  type: string
  packageName: string
  fee: number
  roomName: string | null
  userName: string
  avatar: string
  hastag:string | null
}
interface ApiResponse<T> {
  data: T
}
function ListAllTransaction() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempStatus, setTempStatus] = useState<{ [key: string]: string }>({})
  const [isEditing, setIsEditing] = useState<Amyti | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const handleShowServiceModal = (transaction: Transaction) => {
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
    const fetchAllTransaction = async () => {
      setIsLoadingTransactions(true)
      try {
        const response = await studySpaceAPI.get<ApiResponse<Transaction[]>>(`Transactions`)
        const result = response.data.data
        setTransactions(result || [])
        const initialStatuses: { [key: string]: string } = {}
        result.forEach((transaction) => {
          initialStatuses[transaction.id] = transaction.status
        })
        setTempStatus(initialStatuses)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingTransactions(false)
      }
    }

    fetchAllTransaction()
  }, [user?.userID])

  const handleStatusChange = (transaction: Transaction, status: string) => {
    // setSelectedAmyti(amyti)
    // setNewStatus(status)
    // setIsModalOpen(true)
  }

  const confirmStatusChange = async () => {}

  const handleEditAmity = (transation: Transaction) => {
    // console.log('edit tien tích', amyti)
    // setIsEditing(amyti)
    // // formAmtiy.reset()
    // formAmtiy.reset({
    //   amityName: amyti.amityName,
    //   type: amyti.amityType,
    //   quantity: amyti.quantity,
    //   description: amyti.description || ''
    // })
  }

  const confirmEditAmity = async (values: z.infer<typeof amitySchema>) => {}

  const handleModalAddClose = () => {
    setIsAdding(false)
    formAddAmyti.reset() // Reset form when closing
  }
  const confirmAddAmyti = async (values: z.infer<typeof AddAmytiSchema>) => {}
  if (isLoadingTransactions) {
    return <TableSkeleton />
  }

  return (
    <div className='flex h-full flex-1 flex-col'>
      <div className='flex justify-between'>
        <h1 className='my-4 border-b pb-2 text-3xl font-semibold tracking-wider first:mt-0'>Danh sách giao dịch</h1>
      </div>
      <DataTable
        data={transactions}
        columns={columns(handleStatusChange, handleEditAmity, handleShowServiceModal)}
        Toolbar={DataTableToolbar}
        rowString='Giao dịch'
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

export default ListAllTransaction
