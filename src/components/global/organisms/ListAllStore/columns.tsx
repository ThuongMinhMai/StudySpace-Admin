import { ColumnDef } from '@tanstack/react-table'

import { Tooltip } from 'antd'
import { DataTableColumnHeader } from '../table/col-header'
// import { statuses } from './data/data'
import { Task } from './data/schema'
import { DataTableRowActions } from './row-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/global/atoms/ui/avatar'
import { Badge } from '../../atoms/ui/badge'
import { Badge as Bag } from 'antd'
import { CookingPot, Edit2, Eye, Plus } from 'lucide-react'
import { Button } from '../../atoms/ui/button'
import { Link } from 'react-router-dom'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
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
interface Amyti {
  amityId: number
  amityName: string
  amityType: string
  amityStatus: string
  quantity: number
  description: string | null | undefined
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
export const columns = (
  handleStatusChange: (store: Store, status: string) => void,
  handleEditAmity: (store: Store) => void,
  handleShowServiceModal: (store: Store) => void
): ColumnDef<Store>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => null,
    cell: ({ row }) => null
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên cửa hàng' />,
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        {/* <Tooltip title='Chỉnh sửa' className='mr-1'>
          <Edit2 className='cursor-pointer w-4 text-primary' onClick={() => handleEditName(row.original, row.getValue('StationName'))} />
        </Tooltip> */}
        <span className='max-w-[500px] truncate font-medium'>{row.getValue('name')}</span>
      </div>
    ),
    // filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableHiding: false
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mô tả' />,
    cell: ({ row }) => <div> {row.getValue('description') || 'Không có mô tả'}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Số điện thoại' />,
    cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'address',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Địa chỉ' />,
    cell: ({ row }) => <div>{row.getValue('address')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'openTime',
    header: ({ column }) => null,
    cell: ({ row }) => null,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'closeTime',
    header: ({ column }) => null,
    cell: ({ row }) => null,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'operatingHours',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Giờ hoạt động' />,
    cell: ({ row }) => {
      const formatTime = (dateTime: any) => {
        const date = new Date(dateTime)
        // Format the time as HH:mm
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      const openTime = formatTime(row.getValue('openTime'))
      const closeTime = formatTime(row.getValue('closeTime'))
      return <div>{`${openTime} - ${closeTime}`}</div>
    },
    filterFn: (row, id, value) => {
      const formatTime = (dateTime: any) => {
        const date = new Date(dateTime)
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      const openTime = formatTime(row.getValue('openTime'))
      const closeTime = formatTime(row.getValue('closeTime'))
      const operatingHours = `${openTime} - ${closeTime}`

      return value.includes(operatingHours)
    }
  },
  {
    accessorKey: 'isOverNight',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Dịch vụ 24h' />,
    cell: ({ row }) => {
      const isOverNight = row.getValue('isOverNight')
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isOverNight ? (
            <>
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
              <span>Có</span>
            </>
          ) : (
            <>
              <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />
              <span>Không</span>
            </>
          )}
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'totalBookings',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tổng số lượt đặt' />,
    cell: ({ row }) => <div>{row.getValue('totalBookings')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'totalTransactions',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tổng số giao dịch' />,
    cell: ({ row }) => <div>{row.getValue('totalTransactions')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'totalBookingsInMonth',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Lượt đặt trong tháng' />,
    cell: ({ row }) => <div>{row.getValue('totalBookingsInMonth')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'totalTransactionsInMonth',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Giao dịch trong tháng' />,
    cell: ({ row }) => <div>{row.getValue('totalTransactionsInMonth')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'totalRooms',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tổng số phòng' />,
    cell: ({ row }) => <div>{row.getValue('totalRooms')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'starAverage',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Đánh giá' />,
    cell: ({ row }) => <div>{row.getValue('starAverage')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },

  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => <DataTableRowActions row={row} handleStatusChange={handleStatusChange} />,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  }
]
