import { ColumnDef } from '@tanstack/react-table'
import { Tag } from 'antd'
import { DataTableColumnHeader } from '../table/col-header'
import { Button as ButtonAnt } from 'antd/lib'
import { CheckCircle, Eye, User, UserCheck, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../../atoms/ui/badge'
interface Booking {
  bookingId: number
  userName: string
  userEmail: string
  userAddress: string
  gender: string 
  avatar: string
  bookingDate: string 
  bookingTime: string 
  roomId: number
  roomName: string
  storeName: string
  capacity: number
  pricePerHour: number
  description: string
  status: string 
  area: number
  checkin: boolean
  roomType: 'BASIC' | 'PREMIUM' 
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
            src={row.getValue('avatar')} 
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
    },

    {
      accessorKey: 'userEmail',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
      cell: ({ row }) => <div>{row.getValue('userEmail')}</div>,
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
        const genderValue = row.getValue('gender')
        return (
          <div className='flex justify-center items-center'>
            {genderValue === 'XX' ? (
              <User className='text-pink-500 w-5 h-5' />
            ) : (
              <UserCheck className='text-blue-500 w-5 h-5' /> 
            )}
          </div>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'bookingDate',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày đặt' />,
      cell: ({ row }) => {
        const rawDate = row.getValue('bookingDate') as string
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
      accessorKey: 'bookingTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Giờ đặt' />,
      cell: ({ row }) => <div>{row.getValue('bookingTime')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },

    {
      accessorKey: 'roomName',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tên phòng' />,
      cell: ({ row }) => <div>{row.getValue('roomName')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'storeName',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tên cửa hàng' />,
      cell: ({ row }) => <div>{row.getValue('storeName')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
      cell: ({ row }) => {
        const statusValue = row.getValue('status') as string
        const tagColor = statusValue === 'PAID' ? 'green' : statusValue === 'CANCEL' ? 'red' : 'orange'

        return <Tag color={tagColor}>{statusValue}</Tag>
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
        const spaceType = row.getValue('spaceType') as string

        // Determine tag color and icon based on the space type
        const getSpaceTypeTag = () => {
          switch (spaceType) {
            case 'Library Space':
              return <Tag color='blue'>Thư viện</Tag>
            case 'Meeting Room':
              return <Tag color='green'>Phòng họp</Tag>
            case 'Coffee Space':
              return <Tag color='orange'>Quán cà phê</Tag>
            default:
              return <Tag>{spaceType}</Tag> // Default fallback if needed
          }
        }

        return <div>{getSpaceTypeTag()}</div>
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'checkin',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Checkin' />,
      cell: ({ row }) => {
        const checkinStatus = row.getValue('checkin')

        return checkinStatus ? (
          <div className='flex items-center text-green-500'>
            <CheckCircle size={20} className='mr-1' />
          </div>
        ) : (
          <div className='flex items-center text-red-500'>
            <XCircle size={20} className='mr-1' />
          </div>
        )
      },
      filterFn: (row, id, filterValue) => {
        const checkinStatus = row.getValue(id) ? 'Đã check in' : 'Chưa check in'
        return filterValue.includes(checkinStatus)
      }
    },
    {
      accessorKey: 'transaction',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Xem giao dịch' />,
      cell: ({ row }) => {
        const bookingId = row.getValue('bookingId') as number

        const handleViewTransaction = () => {
          fetchTransactionDetails(bookingId)
        }

        return (
          <div>
            <ButtonAnt
              icon={<Eye className='w-6 h-6 text-primary' />} // Icon to view transaction
              onClick={handleViewTransaction}
              type='link'
            />
          </div>
        )
      },
      enableHiding: false
    }
  ]
}
