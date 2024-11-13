import { ColumnDef } from '@tanstack/react-table'

import { Tag } from 'antd'
import { DataTableColumnHeader } from '../table/col-header'
// import { statuses } from './data/data'
import {
  CreditCardFilled, // Alternative icon for Debit Card
  CreditCardOutlined,
  DollarOutlined,
  PayCircleOutlined
} from '@ant-design/icons' // Import icons from Ant Design
import { Badge } from '../../atoms/ui/badge'
import { formatPrice } from '@/lib/utils'

interface Transaction {
  id: number
  date: string
  paymentMethod: string
  status: string
  type: string
  packageName: string
  fee: number
  roomName: string | null
  userName: string
  avatar: string
  hastag: string | null
}
export const columns = (
  handleStatusChange: (transaction: Transaction, status: string) => void,
  handleEditAmity: (transaction: Transaction) => void,
  handleShowServiceModal: (transaction: Transaction) => void
): ColumnDef<Transaction>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => null,
    cell: ({ row }) => null
  },
  {
    accessorKey: 'hastag',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mã giao dịch' />,
    cell: ({ row }) => {
      const hastag = (row.getValue('hastag') as string) || 'Không có sẵn'
      return (
        <div className='flex space-x-2'>
          {/* <Tooltip title='Chỉnh sửa' className='mr-1'>
          <Edit2 className='cursor-pointer w-4 text-primary' onClick={() => handleEditName(row.original, row.getValue('StationName'))} />
          </Tooltip> */}
          <span className='max-w-[500px] truncate font-medium'># {hastag}</span>
        </div>
      )
    },
    enableHiding: false
  },
  {
    accessorKey: 'avatar',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ảnh' />,
    cell: ({ row }) => (
      <div>
        <img
          className='rounded-full h-12 w-12 object-cover'
          src={row.getValue('avatar')} // Access the image URL correctly
          alt='user'
        />
      </div>
    ),
    enableHiding: false
  },
  {
    accessorKey: 'userName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên người giao dịch' />,
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        {/* <Tooltip title='Chỉnh sửa' className='mr-1'>
          <Edit2 className='cursor-pointer w-4 text-primary' onClick={() => handleEditName(row.original, row.getValue('StationName'))} />
        </Tooltip> */}
        <span className='max-w-[500px] truncate font-medium'>{row.getValue('userName')}</span>
      </div>
    ),
    enableHiding: false
  },
  {
    accessorKey: 'type',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Loại' />,
    cell: ({ row }) => <div>{row.getValue('type')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'packageName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên gói' />,
    cell: ({ row }) => {
      const packageName = (row.getValue('packageName') as string) || 'BOOKING' // Get the package name

      // Define the color based on the package type
      let color: 'default' | 'success' | 'warning' | 'error' | 'processing' | 'success' | 'info'
      if (packageName === 'LUXURY') {
        color = 'success' // Green for luxury
      } else if (packageName === 'ADVANCE') {
        color = 'warning' // Yellow for advance
      } else if (packageName === 'BOOKING') {
        color = 'default'
      } else {
        color = 'processing' // Default for basic or other packages
      }

      return <Tag color={color}>{packageName}</Tag>
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },

  {
    accessorKey: 'date',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày giao dịch' />,
    cell: ({ row }) => {
      const dateString = row.getValue('date') as string // Get the date string
      const date = new Date(dateString) // Convert the string to a Date object

      // Format the date to a readable format (e.g., 'dd/mm/yyyy' or 'mm/dd/yyyy')
      const formattedDate = date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })

      return <div>{formattedDate}</div> // Return the formatted date
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'paymentMethod',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Phương thức thanh toán' />,
    cell: ({ row }) => {
      const paymentMethod = row.getValue('paymentMethod') || 'Không có' // Get the payment method

      // Define the color, text, and icon for each payment method
      let tagColor: 'default' | 'success' | 'warning' | 'error' | 'processing'
      let displayText: string
      let icon: React.ReactNode // Define an icon variable
      switch (paymentMethod) {
        case 'Credit Card':
          tagColor = 'success'
          displayText = 'Thẻ tín dụng'
          icon = <CreditCardOutlined />
          break
        case 'Cash':
          tagColor = 'default'
          displayText = 'Tiền mặt'
          icon = <DollarOutlined />
          break
        case 'PayOS':
          tagColor = 'processing'
          displayText = 'PayOS'
          icon = <PayCircleOutlined /> // Using an alternative icon for PayPal
          break
        case 'Debit Card':
          tagColor = 'warning'
          displayText = 'Thẻ ghi nợ'
          icon = <CreditCardFilled /> // Using an alternative icon for Debit Card
          break
        default:
          tagColor = 'default'
          displayText = 'Không có'
          icon = null // No icon for "Không có"
          break
      }

      return (
        <Tag color={tagColor} icon={icon}>
          {displayText}
        </Tag>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },

  {
    accessorKey: 'fee',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Chi phí' />,
    cell: ({ row }) => <div>{formatPrice(row.getValue('fee'))}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string // Get the status value

      return (
        <div>
          <Badge variant={status === 'PAID' ? 'success' : status === 'CANCEL' ? 'destructive' : 'breed'}>
            {status}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  }
]
