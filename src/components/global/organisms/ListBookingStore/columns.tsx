import { ColumnDef } from '@tanstack/react-table'

import { Tooltip } from 'antd'
import { DataTableColumnHeader } from '../table/col-header'
// import { statuses } from './data/data'
import { Task } from './data/schema'
import { DataTableRowActions } from './row-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/global/atoms/ui/avatar'
import { Badge } from '../../atoms/ui/badge'
import { Edit2, Eye, Plus } from 'lucide-react'
import { Button } from '../../atoms/ui/button'
import { Link, useNavigate } from 'react-router-dom'
// Define the interface for the Service
// interface Service {
//   Service_StationID:string
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

// interface Amenity {
//   id: number
//   name: string
//   type: string
//   status: boolean
//   quantity: number
//   description: string
// }

// interface Room {
//   roomId: number
//   roomName: string
//   storeName: string
//   capacity: number
//   pricePerHour: number
//   description: string
//   status: boolean
//   area: number
//   type: string
//   image: string
//   address: string
//   amitiesInRoom: Amenity[]
// }
interface Booking {
  bookingId: number
  userName: string
  email: string
  userAddress: string
  gender: string // Consider using an enum for gender if there are specific values.
  avatar: string
  bookedDate: string // Consider using Date if you want to work with date objects.
  bookedTime: string // You might also consider using a Date object here.
  checkin: boolean
  roomId: number
  roomName: string
  storeName: string
  capacity: number
  pricePerHour: number
  description: string
  status: string // Consider using a union type for status.
  area: number
  roomType: 'BASIC' | 'PREMIUM' // Consider using a union type for room type.
  spaceType: string
  image: string
  address: string
}
export const columns = (
  navigate: ReturnType<typeof useNavigate>,
  handleStatusChange: (booking: Booking, status: boolean) => void,
  handleEditName: (booking: Booking, newName: string) => void,
  handleShowAmentiModal: (booking: Booking) => void
): ColumnDef<Booking>[] => {
  return [
    {
      accessorKey: 'bookingId',
      header: ({ column }) => null,
      cell: ({ row }) => null,
      enableHiding: false
    },
    {
      accessorKey: 'userName',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tên người thuê' />,
      cell: ({ row }) => <span className='max-w-[500px] truncate font-medium '>{row.getValue('userName')}</span>
      // filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },

    {
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'userAddress',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Địa chỉ' />,
      cell: ({ row }) => <div>{row.getValue('userAddress')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'gender',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Giới tính' />,
      cell: ({ row }) => <div>{row.getValue('gender')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'avatar',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ảnh đại diện' />,
      cell: ({ row }) => <div>{row.getValue('avatar')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'bookedDate',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày đặt' />,
      cell: ({ row }) => <div>{row.getValue('bookedDate')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'bookedTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Giờ đặt' />,
      cell: ({ row }) => <div>{row.getValue('bookedTime')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'checkin',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Checkin' />,
      cell: ({ row }) => <div>{row.getValue('checkin')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'roomName',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tên phòng' />,
      cell: ({ row }) => <div>{row.getValue('roomName')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
      cell: ({ row }) => <div>{row.getValue('status')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'roomType',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Loại phòng' />,
      cell: ({ row }) => <div>{row.getValue('roomType')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'spaceType',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Loại không gian' />,
      cell: ({ row }) => <div>{row.getValue('spaceType')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    }
  ]
}
