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
interface Service {
  Service_StationID:string
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
  amityId: number;      
  amityName: string;   
  amityType: string;    
  amityStatus: string;  
  quantity: number;     
  description: string | null | undefined;
}
export const columns = (
  handleStatusChange: (amyti: Amyti, status: string) => void,
  handleEditAmity: (amyti: Amyti) => void,
  handleShowServiceModal: (amyti: Amyti) => void 
): ColumnDef<Amyti>[] => [
  {
    accessorKey: 'amityId',
    header: ({ column }) => null,
    cell: ({ row }) => null
  },
  {
    accessorKey: 'amityName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên tiện ích' />,
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        {/* <Tooltip title='Chỉnh sửa' className='mr-1'>
          <Edit2 className='cursor-pointer w-4 text-primary' onClick={() => handleEditName(row.original, row.getValue('StationName'))} />
        </Tooltip> */}
        <span className='max-w-[500px] truncate font-medium'>{row.getValue('amityName')}</span>
      </div>
    ),
    // filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableHiding: false
  },
  {
    accessorKey: 'amityType',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Loại tiện ích' />,
    cell: ({ row }) => <div>{row.getValue('amityType')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mô tả' />,
    cell: ({ row }) => <div>  {row.getValue('description') || 'Không có mô tả'}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Số lượng' />,
    cell: ({ row }) => <div>{row.getValue('quantity')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  // {
  //   accessorKey: 'ServiceTypeInStation',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Dịch vụ' />,
  //   cell: ({ row }) => <div>{row.getValue('ServiceTypeInStation')}</div>,
  //   filterFn: (row, id, value) => value.includes(row.getValue(id))
  // },
  // {
  //   accessorKey: 'ServiceTypeInStation',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Dịch vụ' />,
  //   cell: ({ row }) => {
  //     const services = row.original.ServiceTypeInStation
  //     return (
  //       <div>
  //         <div
  //         className='text-primary flex gap-2 items-center cursor-pointer'
  //         onClick={() => handleShowServiceModal(row.original)} // Use the handler here
  //       >
  //         {services.length === 0 ? (
  //           <>
  //             <Plus className="w-4 h-4 mr-2" />
  //             Thêm dịch vụ
  //           </>
  //         ) : (
  //           <>
  //             <Eye className="w-4 h-4 mr-2" />
  //             Xem dịch vụ
  //           </>
  //         )}
  //       </div>
  //       </div>
  //     )
  //   }
  //   // filterFn: (row, id, value) => value.includes(row.getValue(id))
  // },
  {
    accessorKey: 'amityStatus',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => <DataTableRowActions row={row} handleStatusChange={handleStatusChange} />,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    // This is the column with the edit icon and no title
    accessorKey: 'edit',
    header: () => null,
    cell: ({ row }) => (
      <Tooltip title='Chỉnh sửa'>
        <Edit2 
          className='cursor-pointer w-4 text-primary' 
          onClick={() => handleEditAmity(row.original)}
        />
      </Tooltip>
    ),
    enableHiding: false,
  }
]
