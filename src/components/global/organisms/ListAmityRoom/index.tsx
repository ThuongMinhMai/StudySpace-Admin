import { useAuth } from '@/auth/AuthProvider'
import { AddAmytiSchema, amitySchema } from '@/components/Schema/AmitySchema'
import studySpaceAPI from '@/lib/studySpaceAPI'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogTitle } from '@radix-ui/react-dialog'
import axios from 'axios'
import { Loader, Plus } from 'lucide-react'
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
function ListAmityStore() {
  const { user } = useAuth()
  const [amyties, setAmyties] = useState<Amyti[]>([])
  const [isLoadingAmyties, setIsLoadingAmyties] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAmyti, setSelectedAmyti] = useState<Amyti | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [tempStatus, setTempStatus] = useState<{ [key: string]: string }>({})
  const [isEditing, setIsEditing] = useState<Amyti | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const handleShowServiceModal = (amyti: Amyti) => {
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

    fetchAmyties()
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
          description:
            newStatus === 'Active'
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

  const handleEditAmity = (amyti: Amyti) => {
    setIsEditing(amyti)
    formAmtiy.reset({
      amityName: amyti.amityName,
      type: amyti.amityType,
      quantity: amyti.quantity,
      description: amyti.description || ''
    })
  }

  const confirmEditAmity = async (values: z.infer<typeof amitySchema>) => {
    if (isEditing) {
      setIsLoadingUpdate(true)
      try {
        await studySpaceAPI.put(`/Amity/${isEditing.amityId}?supplierId=${user?.userID}`, {
          name: values.amityName,
          type: values.type,
          quantity: values.quantity,
          description: values.description
        })

        const updatedData = {
          amityName: values.amityName,
          quantity: values.quantity,
          description: values.description,
          amityType: isEditing.amityType,
          amityStatus: isEditing.amityStatus
        }
        setAmyties(
          amyties.map((amyti) =>
            amyti.amityId === isEditing.amityId
              ? { ...amyti, ...updatedData } // Update the amity with new values
              : amyti
          )
        )
        toast({
          variant: 'success',
          title: 'Cập nhật thành công',
          description: 'Đã cập nhật tiện ích'
        })
        setIsEditing(null)
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const message = error.response.data.Result.message
          toast({
            variant: 'destructive',
            title: 'Không thể cập nhật tiện ích',
            description: message || 'Vui lòng thử lại sau'
          })
        }
      } finally {
        setIsLoadingUpdate(false)
      }
    }
  }

  const handleAddAmyti = () => {
    setIsAdding(true)
  }
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
  if (isLoadingAmyties) {
    return <TableSkeleton />
  }

  return (
    <div className='flex h-full flex-1 flex-col'>
      <div className='flex justify-between'>
        <h1 className='my-4 border-b pb-2 text-3xl font-semibold tracking-wider first:mt-0'>Danh sách tiện ích</h1>
        <Button
          className='flex justify-center items-center bg-white border-primary border-[1px] text-primary hover:bg-primary hover:text-white'
          onClick={handleAddAmyti}
        >
          <Plus className='w-6 mr-1' />
          Thêm tiện ích
        </Button>
      </div>
      <DataTable
        data={amyties}
        columns={columns(handleStatusChange, handleEditAmity, handleShowServiceModal)}
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
                      <FormLabel>Tên tiện ích</FormLabel>
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

export default ListAmityStore
