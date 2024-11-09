import { Row } from '@tanstack/react-table'
import { Badge } from '../../atoms/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../atoms/ui/select'

interface DataTableRowActionsProps<TData extends Amyti> {
  // Add extends Route
  row: Row<TData>
  handleStatusChange: (amyti: Amyti, status: string) => void
}

interface Amyti {
  amityId: number
  amityName: string
  amityType: string
  amityStatus: string
  quantity: number
  description: string | null | undefined
}
export function DataTableRowActions<TData extends Amyti>({ row, handleStatusChange }: DataTableRowActionsProps<TData>) {
  return (
    <div>
      <Select value={row.original.amityStatus} onValueChange={(value) => handleStatusChange(row.original, value)}>
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
