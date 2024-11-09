/** @format */
'use client'

import PageTitle from '@/components/global/organisms/PageTitle'
import { columns } from '@/components/local/data-table-user/column'
import { DataTable } from '@/components/local/data-table-user/data-table'
import studySpaceAPI from '@/lib/studySpaceAPI'
import { User } from '@/types/User'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import Loading from '../molecules/Loading'

type Props = {}

const defaultValue: User[] = [
  {
    UserName: '',
    FullName: '',
    Email: '',
    CreatedDate: '',
    Status: ''
  }
]

export default function UsersPage({}: Props) {
  const [Data, setData] = useState<User[]>(defaultValue)
  const toastShown = useRef(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await studySpaceAPI.get<User[]>('/user-management/managed-users/role-name/Customer')
        setData(data)
        if (!toastShown.current) {
          toast.success('Tìm kiếm người dùng thành công')
          toastShown.current = true
        }
      } catch (error) {
        toast.error('Không thể tìm kiếm người dùng')
      }
    }
    fetchUsers()
  }, [])

  return Data[0].CreatedDate === '' ? (
    <Loading />
  ) : (
    <div className='flex flex-col gap-5  w-full'>
      <PageTitle title='Danh sách người dùng' />
      <DataTable columns={columns} data={Data} />
    </div>
  )
}
