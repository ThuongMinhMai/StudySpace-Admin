import { ColumnDef } from '@tanstack/react-table'
import { Tooltip } from 'antd'
import { Edit2 } from 'lucide-react'
import { DataTableColumnHeader } from '../table/col-header'
import { DataTableRowActions } from './row-actions'
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

interface Amyti {
  amityId: number
  amityName: string
  amityType: string
  amityStatus: string
  quantity: number
  description: string | null | undefined
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
    cell: ({ row }) => <div> {row.getValue('description') || 'Không có mô tả'}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Số lượng' />,
    cell: ({ row }) => <div>{row.getValue('quantity')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },

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
        <Edit2 className='cursor-pointer w-4 text-primary' onClick={() => handleEditAmity(row.original)} />
      </Tooltip>
    ),
    enableHiding: false
  }
]
