import { ColumnDef } from '@tanstack/react-table'

import { Tag, Tooltip } from 'antd'
import { DataTableColumnHeader } from '../table/col-header'
// import { statuses } from './data/data'
import { Task } from './data/schema'
import { DataTableRowActions } from './row-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/global/atoms/ui/avatar'
import { Badge } from '../../atoms/ui/badge'
import { Book, CheckCircle, Coffee, Edit2, Eye, Plus, User, UserCheck, Users, XCircle } from 'lucide-react'
import { Button } from '../../atoms/ui/button'
import { Button as ButtonAnt } from 'antd/lib'
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
  handleShowAmentiModal: (booking: Booking) => void,
  fetchTransactionDetails: (bookingId: number) => void
): ColumnDef<Booking>[] => {
  return [
    {
      accessorKey: 'bookingId',
      header: ({ column }) => null,
      cell: ({ row }) => null,
      enableHiding: false
    },
    {
      accessorKey: 'avatar',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ảnh đại diện' />,
      cell: ({ row }) => (
        <div>
          <img
            className='rounded-full h-10 w-10 object-cover'
            src={row.getValue('avatar')} // Access the image URL correctly
            alt='avartarUser'
          />
        </div>
      ),
      filterFn: (row, id, value) => value.includes(row.getValue(id))
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
      cell: ({ row }) => {
        const genderValue = row.getValue('gender');
        return (
          <div className="flex justify-center items-center">
            {genderValue === 'XX' ? (
              <User  className="text-pink-500 w-5 h-5" /> // Female icon with styling
            ) : (
              <UserCheck  className="text-blue-500 w-5 h-5" /> // Male icon with styling
            )}
          </div>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'bookedDate',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày đặt' />,
      cell: ({ row }) => {
        const rawDate = row.getValue('bookedDate') as string 
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
      accessorKey: 'bookedTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Giờ đặt' />,
      cell: ({ row }) => <div>{row.getValue('bookedTime')}</div>,
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
      cell: ({ row }) => {
        const statusValue = row.getValue('status') as string;
        const tagColor =
          statusValue === 'PAID'
            ? 'green'
            : statusValue === 'CANCEL'
            ? 'red'
            : 'orange';
    
        return <Tag color={tagColor}>{statusValue}</Tag>;
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'roomType',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Loại phòng' />,
      cell: ({ row }) => {
        const roomType = row.getValue<string>('roomType')

        // Determine the badge variant based on roomType
        const badgeVariant = roomType === 'BASIC' ? 'info' : roomType === 'PREMIUM' ? 'warning' : 'default'

        return (
          <div className='cursor-pointer' onClick={() => navigate(`/roomStore/room-detail/${row.original.roomId}`)}>
            <Badge variant={badgeVariant || 'default'}>{roomType}</Badge>
          </div>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'spaceType',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Loại không gian' />,
      cell: ({ row }) => {
        const spaceType = row.getValue('spaceType') as string;
    
        // Determine tag color and icon based on the space type
        const getSpaceTypeTag = () => {
          switch (spaceType) {
            case 'Library Space':
              return (
                <Tag color="blue"  >
                  Thư viện
                </Tag>
              );
            case 'Meeting Room':
              return (
                <Tag color="green">
                  Phòng họp
                </Tag>
              );
            case 'Coffee Space':
              return (
                <Tag color="orange" >
                  Quán cà phê
                </Tag>
              );
            default:
              return <Tag>{spaceType}</Tag>; // Default fallback if needed
          }
        };
    
        return <div>{getSpaceTypeTag()}</div>;
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'checkin',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Checkin' />,
      cell: ({ row }) => {
        const checkinStatus = row.getValue('checkin');
    
        return checkinStatus ? (
          <div className="flex items-center text-green-500">
            <CheckCircle size={20} className="mr-1" />
          </div>
        ) : (
          <div className="flex items-center text-red-500">
            <XCircle size={20} className="mr-1" />
          </div>
        );
      },
      // filterFn: (row, id, value) => value.includes(row.getValue(id))
      filterFn: (row, id, filterValue) => {
        const checkinStatus = row.getValue(id) ? 'Đã check in' : 'Chưa check in'
        return filterValue.includes(checkinStatus)
      }
    },
    {
      accessorKey: 'transaction',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Xem giao dịch' />,
      cell: ({ row }) => {
        const bookingId = row.getValue('bookingId') as number;
        
        const handleViewTransaction = () => {
          fetchTransactionDetails(bookingId);
        };

        return (
          <div>
            <ButtonAnt 
              icon={<Eye className='w-6 h-6 text-primary'/>} // Icon to view transaction
              onClick={handleViewTransaction}
              type="link"
            />
          </div>
        );
      },
      enableHiding: false
    },
   
  ]
}
