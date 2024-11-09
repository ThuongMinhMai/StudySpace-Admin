import { ColumnDef } from '@tanstack/react-table'

import { Tooltip } from 'antd'
import { DataTableColumnHeader } from '../table/col-header'
// import { statuses } from './data/data'
import { User, UserCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../../atoms/ui/badge'
import { DataTableRowActions } from './row-actions'

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
export const columns = (
  navigate: ReturnType<typeof useNavigate>,
  handleStatusChange: (account: Account, status: boolean) => void,
  handleEditName: (account: Account, newName: string) => void,
  handleShowAmentiModal: (account: Account) => void
): ColumnDef<Account>[] => {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => null,
      cell: ({ row }) => null,
      enableHiding: false
    },
    {
      accessorKey: 'avatarUrl',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ảnh' />,
      cell: ({ row }) => (
        <div>
          <img
            className='rounded-full h-12 w-12 object-cover'
            src={row.getValue('avatarUrl')} // Access the image URL correctly
            alt='account'
          />
        </div>
      ),
      enableHiding: false
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tên tài khoản' />,
      cell: ({ row }) => (
        <div>
          <span className='max-w-[500px] truncate font-medium '>{row.getValue('name')}</span>
        </div>
      ),
      enableHiding: false
    },

    {
      accessorKey: 'roleName',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Vai trò' />,
      cell: ({ row }) => <div>{row.getValue('roleName')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Số điện thoại' />,
      cell: ({ row }) => <div>{row.getValue('phone')}</div>,
      // filterFn: (row, id, value) => value.includes(row.getValue(id))
      filterFn: (row, id, value) => {
        const { min, max } = value || {}
        const area = row.getValue<number>(id)

        // Check if the area falls within the range
        if (min !== undefined && max !== undefined) {
          return area >= min && area <= max
        } else if (min !== undefined) {
          return area >= min
        } else if (max !== undefined) {
          return area <= max
        }
        return true // If no filter is set, include the row
      }
    },

    {
      accessorKey: 'address',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Địa chỉ' />,
      cell: ({ row }) => <div>{row.getValue('address')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },

    {
      accessorKey: 'gender',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Giới tính' />,
      cell: ({ row }) => {
        const genderValue = row.getValue('gender')
        return (
          <div className='flex justify-center items-center'>
            {genderValue === 'XX' ? (
              <User className='text-pink-500 w-5 h-5' /> // Female icon with styling
            ) : (
              <UserCheck className='text-blue-500 w-5 h-5' /> // Male icon with styling
            )}
          </div>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'dob',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày sinh' />,
      cell: ({ row }) => {
        const rawDate = row.getValue('dob') as string
        const dateObject = new Date(rawDate)
        const formattedDate = !isNaN(dateObject.getTime())
          ? dateObject.toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          : 'Invalid Date' // Handle invalid date case
        return <div>{formattedDate}</div>
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'wallet',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ví' />,
      cell: ({ row }) => <div>{row.getValue('wallet')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
      cell: ({ row }) => {
        // Check if the roleName is 'Admin'
        const roleName = row.getValue('roleName') as string
        const isActive = row.getValue('isActive') as boolean

        if (roleName === 'Admin') {
          // Show the status if the roleName is Admin
          return (
            <div className='flex items-center'>
              <Tooltip
                title={
                  isActive ? 'Bạn không có quyền chỉnh sửa tài khoản này' : 'Bạn không có quyền chỉnh sửa tài khoản này'
                }
              >
                <Badge variant={isActive ? 'success' : 'destructive'}>
                  {isActive ? 'Hoạt động' : 'Không hoạt động'}
                </Badge>
              </Tooltip>
            </div>
          )
        } else {
          // Use DataTableRowActions component for non-Admin roles
          return <DataTableRowActions row={row} handleStatusChange={handleStatusChange} />
        }
      },
      filterFn: (row, id, value) => {
        const rowValue = row.getValue(id)
        if (typeof rowValue === 'boolean') {
          return Array.isArray(value) ? value.includes(rowValue) : rowValue === value
        }
        return false
      }
    }
  ]
}
