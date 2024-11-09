import { Row } from '@tanstack/react-table'
import { Badge } from '../../atoms/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../atoms/ui/select'

interface DataTableRowActionsProps<TData extends Account> {
  row: Row<TData>
  handleStatusChange: (account: Account, status: boolean) => void
}
interface Account {
  id: number
  roleName: string
  name: string
  email: string
  phone: string
  address: string
  gender: string
  dob: string
  isActive: boolean
  wallet: number
  avatarUrl: string
}

export function DataTableRowActions<TData extends Account>({
  row,
  handleStatusChange
}: DataTableRowActionsProps<TData>) {
  // Convert boolean status to string for the select value
  const statusString = row.original.isActive ? 'true' : 'false'

  return (
    <div>
      <Select
        value={statusString}
        onValueChange={(value) => handleStatusChange(row.original, value === 'true' ? true : false)}
      >
        <SelectTrigger className='w-fit'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className='w-fit'>
          <SelectItem value='true'>
            <Badge variant='success'>Hoạt động</Badge>
          </SelectItem>
          <SelectItem value='false'>
            <Badge variant='destructive'>Không hoạt động</Badge>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
