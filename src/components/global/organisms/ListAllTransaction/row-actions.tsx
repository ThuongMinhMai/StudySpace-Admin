import { Row } from '@tanstack/react-table'
import { Badge } from '../../atoms/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../atoms/ui/select'

interface DataTableRowActionsProps<TData extends Transaction> {
  // Add extends Route
  row: Row<TData>
  handleStatusChange: (transaction: Transaction, status: string) => void
}

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
}
export function DataTableRowActions<TData extends Transaction>({
  row,
  handleStatusChange
}: DataTableRowActionsProps<TData>) {
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
          <SelectItem value='Inactive'>
            <Badge variant='destructive'>Không hoạt động</Badge>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
