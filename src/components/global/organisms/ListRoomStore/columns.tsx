import { ColumnDef } from '@tanstack/react-table'

import { Tag } from 'antd'
import { DataTableColumnHeader } from '../table/col-header'
// import { statuses } from './data/data'
import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../../atoms/ui/badge'
import { DataTableRowActions } from './row-actions'
import { formatPrice } from '@/lib/utils'

interface Amenity {
  id: number
  name: string
  type: string
  status: boolean
  quantity: number
  description: string
}

interface Room {
  roomId: number
  roomName: string
  storeName: string
  capacity: number
  pricePerHour: number
  description: string
  status: boolean
  area: number
  type: string
  image: string
  address: string
  amitiesInRoom: Amenity[]
}

export const columns = (
  navigate: ReturnType<typeof useNavigate>,
  handleStatusChange: (route: Room, status: boolean) => void,
  handleEditName: (room: Room, newName: string) => void,
  handleShowAmentiModal: (room: Room) => void
): ColumnDef<Room>[] => {
  return [
    {
      accessorKey: 'roomId',
      header: ({ column }) => null,
      cell: ({ row }) => null,
      enableHiding: false
    },
    {
      accessorKey: 'image',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ảnh' />,
      cell: ({ row }) => (
        <div
          className='flex space-x-2 cursor-pointer'
          onClick={() => navigate(`/roomStore/room-detail/${row.original.roomId}`)}
        >
          {/* <Tooltip title='Chỉnh sửa' className='mr-1'>
          <Edit2 className='cursor-pointer w-4 text-primary' onClick={() => handleEditName(row.original, row.getValue('roomName'))} />
        </Tooltip> */}
          <img
            className='rounded-md h-16 w-28 object-cover'
            src={row.getValue('image')} // Access the image URL correctly
            alt='Room'
          />
        </div>
      ),
      // filterFn: (row, id, value) => value.includes(row.getValue(id)),
      enableHiding: false
    },
    {
      accessorKey: 'roomName',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tên phòng' />,
      cell: ({ row }) => (
        <div
          className='flex space-x-2 cursor-pointer'
          onClick={() => navigate(`/roomStore/room-detail/${row.original.roomId}`)}
        >
          {/* <Tooltip title='Chỉnh sửa' className='mr-1'>
          <Edit2 className='cursor-pointer w-4 text-primary' onClick={() => handleEditName(row.original, row.getValue('roomName'))} />
        </Tooltip> */}
          <span className='max-w-[500px] truncate font-medium '>{row.getValue('roomName')}</span>
        </div>
      ),
      // filterFn: (row, id, value) => value.includes(row.getValue(id)),
      enableHiding: false
    },

    {
      accessorKey: 'capacity',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Số người' />,
      cell: ({ row }) => (
        <div className='cursor-pointer' onClick={() => navigate(`/roomStore/room-detail/${row.original.roomId}`)}>
          {row.getValue('capacity')}
        </div>
      ),
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'pricePerHour',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Giá/giờ' />,
      cell: ({ row }) => (
        <div className='cursor-pointer' onClick={() => navigate(`/roomStore/room-detail/${row.original.roomId}`)}>
          {formatPrice((row.getValue('pricePerHour') as number) * 1000)}
        </div>
      ),
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'area',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Diện tích' />,
      cell: ({ row }) => (
        <div className='cursor-pointer' onClick={() => navigate(`/roomStore/room-detail/${row.original.roomId}`)}>
          {row.getValue('area')}
        </div>
      ),
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
              return (
                <Tag
                  className='cursor-pointer'
                  onClick={() => navigate(`/roomStore/room-detail/${row.original.roomId}`)}
                >
                  {spaceType}
                </Tag>
              ) // Default fallback if needed
          }
        }

        return <div>{getSpaceTypeTag()}</div>
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'address',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Địa chỉ' />,
      cell: ({ row }) => (
        <div className='cursor-pointer' onClick={() => navigate(`/roomStore/room-detail/${row.original.roomId}`)}>
          {row.getValue('address')}
        </div>
      ),
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },

    {
      accessorKey: 'amitiesInRoom',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tiện ích hiện có' />,
      cell: ({ row }) => {
        const amenti = row.original.amitiesInRoom
        return (
          <div>
            <div
            // Use the handler here
            >
              {amenti.length === 0 ? (
                <>
                  {/* <Plus className="w-4 h-4 mr-2" /> */}
                  Chưa có tiện ích
                </>
              ) : (
                <div
                  className='text-primary flex gap-2 items-center cursor-pointer'
                  onClick={() => handleShowAmentiModal(row.original)}
                >
                  <Eye className='w-4 h-4 mr-2' />
                  Xem tiện ích
                </div>
              )}
            </div>
          </div>
        )
      }
      // filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
      cell: ({ row }) => <DataTableRowActions row={row} handleStatusChange={handleStatusChange} />,
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
