import { Row } from '@tanstack/react-table'
import { Badge } from '../../atoms/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../atoms/ui/select'

interface DataTableRowActionsProps<TData extends Store> {
  // Add extends Route
  row: Row<TData>
  handleStatusChange: (store: Store, status: string) => void
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

export function DataTableRowActions<TData extends Store>({ row, handleStatusChange }: DataTableRowActionsProps<TData>) {
  return (
    <div>
      <Select value={row.original.status} onValueChange={(value) => handleStatusChange(row.original, value)}>
        <SelectTrigger className='w-fit'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className='w-fit'>
          <SelectItem value='Active'>
            <Badge variant='success'>Hoạt động</Badge>
          </SelectItem>
          <SelectItem value='Unactive'>
            <Badge variant='destructive'>Không hoạt động</Badge>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
