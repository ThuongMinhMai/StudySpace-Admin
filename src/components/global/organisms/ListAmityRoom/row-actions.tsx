import { useState } from 'react'
import { Row } from '@tanstack/react-table'
import axios from 'axios'
import { toast } from '../../atoms/ui/use-toast'
import studySpaceAPI from '@/lib/studySpaceAPI'
import { Badge } from '../../atoms/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../atoms/ui/select'
import { useAuth } from '@/auth/AuthProvider'
import { Dialog, DialogContent, DialogOverlay } from '../../atoms/ui/dialog'
import { Button } from '@/components/global/atoms/ui/button'
import { Loader } from 'lucide-react'

interface DataTableRowActionsProps<TData extends Amyti> {
  // Add extends Route
  row: Row<TData>
  handleStatusChange: (amyti: Amyti, status: string) => void;

}

// Define the interface for the Service
interface Service {
  Service_StationID:string
	ServiceID: string;
	Price: number;
	Name: string;
	ImageUrl: string;
  }
  
  // Define the interface for the ServiceType
  interface ServiceType {
	ServiceTypeID: string;
	ServiceTypeName: string;
	ServiceInStation: Service[];
  }
  
  // Define the interface for the Station
  interface Station {
	StationID: string;
	CityID: string;
	CityName: string;
	StationName: string;
	Status: string;
	ServiceTypeInStation: ServiceType[];
  }
  interface Amyti {
    amityId: number;      
    amityName: string;   
    amityType: string;    
    amityStatus: string;  
    quantity: number;     
    description: string | null | undefined;
  }
export function DataTableRowActions<TData extends Amyti>({ row,handleStatusChange }: DataTableRowActionsProps<TData>) {
  const { user } = useAuth()
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [tempStatus, setTempStatus] = useState<{ [key: string]: string }>({
    [row.original.amityId]: row.original.amityStatus
  })


  return (
    <div>
      <Select
        value={row.original.amityStatus}
        onValueChange={(value) => handleStatusChange(row.original, value)}
      >
        <SelectTrigger className='w-fit'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className='w-fit'>
          <SelectItem value="Active">
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
