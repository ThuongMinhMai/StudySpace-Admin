import { useAuth } from '@/auth/AuthProvider'
import studySpaceAPI from '@/lib/studySpaceAPI'
import axios from 'axios'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../atoms/ui/button'
import { Dialog, DialogContent, DialogOverlay } from '../../atoms/ui/dialog'
import { toast } from '../../atoms/ui/use-toast'
import { DataTable } from '../table/main'
import TableSkeleton from '../TableSkeleton'
import { columns } from './columns'
import { DataTableToolbar } from './toolbar'

interface ApiResponse<T> {
  data: T
}

interface Account {
  id: number
  roleName: string
  name: string
  email: string
  phone: string
  address: string
  gender: string
  dob: string
  isActive: boolean
  wallet: number
  avatarUrl: string
}
function ListAllAccount() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [newStatus, setNewStatus] = useState<boolean>()
  const [tempStatus, setTempStatus] = useState<{ [key: string]: boolean }>({})

  const handleShowAmentiModal = (account: Account) => {
    // setSelectedRoom(room)
    // setAmentiModalVisible(true)
  }

  useEffect(() => {
    const fetchAllAccounts = async () => {
      setIsLoadingAccounts(true)
      try {
        const response = await studySpaceAPI.get<ApiResponse<Account[]>>(`/Accounts`)

        const result = response.data.data
        setAccounts(result || [])
        const initialStatuses: { [key: string]: boolean } = {}
        result.forEach((account: Account) => {
          initialStatuses[account.id] = account.isActive
        })
        setTempStatus(initialStatuses)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingAccounts(false)
      }
    }
    fetchAllAccounts()
  }, [user?.userID])

  const handleStatusChange = (account: Account, status: boolean) => {
    setSelectedAccount(account)
    setNewStatus(status)
    setIsModalOpen(true)
  }

  const confirmStatusChange = async () => {
    setIsLoadingUpdate(true)
    if (selectedAccount) {
      try {
        // Ensure `newStatus` is correctly defined as a boolean before making the API call
        const statusToUpdate = newStatus !== undefined ? newStatus : selectedAccount.isActive // Convert to boolean if necessary

        // Send the API request to update the status
        await studySpaceAPI.put(`/Accounts/status/${selectedAccount.id}`)

        // Update the rooms state
        setAccounts((prevAcc) =>
          prevAcc.map((acc) => (acc.id === selectedAccount.id ? { ...acc, isActive: statusToUpdate } : acc))
        )

        // Update temp status
        setTempStatus((prevTempStatus) => ({
          ...prevTempStatus,
          [selectedAccount.id]: statusToUpdate
        }))

        // Display success toast notification
        toast({
          variant: 'success',
          title: 'Cập nhật thành công',
          description: 'Đã đổi trạng thái tài khoản này thành ' + (statusToUpdate ? 'Hoạt động' : 'Không hoạt động')
        })
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const message = error.response.data.Result.message || 'Vui lòng thử lại sau'
          // Reset the temporary status if there's an error
          setTempStatus((prevTempStatus) => ({
            ...prevTempStatus,
            [selectedAccount.id]: selectedAccount.isActive
          }))
          // Display error toast notification
          toast({
            variant: 'destructive',
            title: 'Không thể cập nhật trạng thái tài khoản',
            description: message
          })
        }
      } finally {
        setIsLoadingUpdate(false)
        setIsModalOpen(false)
      }
    }
  }
  const handleEditName = (account: Account, currentName: string) => {
    // setIsEditing(room)
    // formRoom.reset({ roomName: currentName })
  }

  if (isLoadingAccounts) {
    return <TableSkeleton />
  }

  return (
    <div className='flex h-full flex-1 flex-col'>
      <div className='flex justify-between'>
        <h1 className='my-4 border-b pb-2 text-3xl font-semibold tracking-wider first:mt-0'>Danh sách tài khoản</h1>
      </div>
      <DataTable
        data={accounts}
        columns={columns(navigate, handleStatusChange, handleEditName, handleShowAmentiModal)}
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
    </div>
  )
}

export default ListAllAccount
