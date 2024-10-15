import { useState } from 'react';
import { Row } from '@tanstack/react-table';
import axios from 'axios';
import { toast } from '../../atoms/ui/use-toast';
import studySpaceAPI from '@/lib/studySpaceAPI';
import { Badge } from '../../atoms/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../atoms/ui/select';
import { useAuth } from '@/auth/AuthProvider';
import { Dialog, DialogContent, DialogOverlay } from '../../atoms/ui/dialog';
import { Button } from '@/components/global/atoms/ui/button';
import { Loader } from 'lucide-react';

interface DataTableRowActionsProps<TData extends Account> {
  row: Row<TData>;
  handleStatusChange: (account: Account, status: boolean) => void;
}
interface Account {
  id: number,
  roleName: string,
  name: string,
  email: string,
  phone:string,
  address: string,
  gender: string,
  dob: string,
  isActive: boolean,
  wallet: number,
  avatarUrl: string
}
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

export function DataTableRowActions<TData extends Account>({ row, handleStatusChange }: DataTableRowActionsProps<TData>) {
  const { user } = useAuth();
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Room | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [tempStatus, setTempStatus] = useState<{ [key: string]: boolean }>({
    [row.original.id]: row.original.isActive,
  });

  // Convert boolean status to string for the select value
  const statusString = row.original.isActive ? 'true' : 'false';

  return (
    <div>
      <Select
        value={statusString}
        onValueChange={(value) => handleStatusChange(row.original, value === 'true' ? true : false)}
      >
        <SelectTrigger className="w-fit">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="w-fit">
          <SelectItem value="true">
            <Badge variant="success">Hoạt động</Badge>
          </SelectItem>
          <SelectItem value="false">
            <Badge variant="destructive">Không hoạt động</Badge>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
