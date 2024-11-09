import { Row } from '@tanstack/react-table'
import { Badge } from '../../atoms/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../atoms/ui/select'

interface DataTableRowActionsProps<TData extends Room> {
  row: Row<TData>
  handleStatusChange: (room: Room, status: boolean) => void
}

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

export function DataTableRowActions<TData extends Room>({ row, handleStatusChange }: DataTableRowActionsProps<TData>) {
  // Convert boolean status to string for the select value
  const statusString = row.original.status ? 'true' : 'false'

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
