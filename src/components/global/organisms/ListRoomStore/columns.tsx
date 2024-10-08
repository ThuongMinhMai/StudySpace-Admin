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
import { Link } from 'react-router-dom'
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

interface Amenity {
  id: number;
  name: string;
  type: string;
  status: boolean;
  quantity: number;
  description: string;
}

 interface Room {
  roomId: number;
  roomName: string;
  storeName: string;
  capacity: number;
  pricePerHour: number;
  description: string;
  status: boolean;
  area: number;
  type: string;
  image: string;
  address: string;
  amitiesInRoom: Amenity[];
}
export const columns = (
  handleStatusChange: (route: Room, status: boolean) => void,
  handleEditName: (room: Room, newName: string) => void,
  handleShowAmentiModal: (room: Room) => void 
): ColumnDef<Room>[] => [
  {
    accessorKey: 'roomId',
    header: ({ column }) => null,
    cell: ({ row }) => null,
    enableHiding: false, 
  },
  {
    accessorKey: 'roomName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên phòng' />,
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        {/* <Tooltip title='Chỉnh sửa' className='mr-1'>
          <Edit2 className='cursor-pointer w-4 text-primary' onClick={() => handleEditName(row.original, row.getValue('roomName'))} />
        </Tooltip> */}
        <span className='max-w-[500px] truncate font-medium'>{row.getValue('roomName')}</span>
      </div>
    ),
    // filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableHiding: false
  },
  // {
  //   accessorKey: 'storeName',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Tên cửa hàng' />,
  //   cell: ({ row }) => <div>{row.getValue('storeName')}</div>,
  //   filterFn: (row, id, value) => value.includes(row.getValue(id))
  // },
  {
    accessorKey: 'capacity',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Số người' />,
    cell: ({ row }) => <div>{row.getValue('capacity')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'pricePerHour',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Giá/giờ' />,
    cell: ({ row }) => <div>{row.getValue('pricePerHour')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'area',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Diện tích' />,
    cell: ({ row }) => <div>{row.getValue('area')}</div>,
    // filterFn: (row, id, value) => value.includes(row.getValue(id))
    filterFn: (row, id, value) => {
      const { min, max } = value || {};
      const area = row.getValue<number>(id);

      // Check if the area falls within the range
      if (min !== undefined && max !== undefined) {
        return area >= min && area <= max;
      } else if (min !== undefined) {
        return area >= min;
      } else if (max !== undefined) {
        return area <= max;
      }
      return true; // If no filter is set, include the row
    },
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
  },
  {
    accessorKey: 'address',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Địa chỉ' />,
    cell: ({ row }) => <div>{row.getValue('address')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  // {
  //   accessorKey: 'ServiceTypeInStation',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Dịch vụ' />,
  //   cell: ({ row }) => <div>{row.getValue('ServiceTypeInStation')}</div>,
  //   filterFn: (row, id, value) => value.includes(row.getValue(id))
  // },
  {
    accessorKey: 'amitiesInRoom',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Cơ sở vật chất' />,
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
            <div  className='text-primary flex gap-2 items-center cursor-pointer'
            onClick={() => handleShowAmentiModal(row.original)} >
              <Eye className="w-4 h-4 mr-2" />
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
      const rowValue = row.getValue(id);
      if (typeof rowValue === 'boolean') {
        return Array.isArray(value) ? value.includes(rowValue) : rowValue === value;
      }
      return false; 
    }
  }
]
