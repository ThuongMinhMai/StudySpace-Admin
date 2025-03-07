// import { useDispatch, useSelector } from 'react-redux'

import { columns } from './columns'

import { DataTable } from '../table/main'
// import { RootState } from '@/store'
import { DataTableToolbar } from './toolbar'
const users: any = [
  {
    id: '1',
    avatar: 'https://via.placeholder.com/150',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    birthday: '1990-01-01',
    gender: 'Male',
    role: 'Admin',
    status: true
  },
  {
    id: '2',
    avatar: 'https://via.placeholder.com/150',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '098-765-4321',
    birthday: '1992-02-02',
    gender: 'Female',
    role: 'User',
    status: false
  },
  {
    id: '3',
    avatar: 'https://via.placeholder.com/150',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '111-222-3333',
    birthday: '1985-03-03',
    gender: 'Female',
    role: 'User',
    status: true
  },
  {
    id: '4',
    avatar: 'https://via.placeholder.com/150',
    name: 'Bob Brown',
    email: 'bob.brown@example.com',
    phone: '444-555-6666',
    birthday: '1978-04-04',
    gender: 'Male',
    role: 'Moderator',
    status: true
  },
  {
    id: '5',
    avatar: 'https://via.placeholder.com/150',
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    phone: '777-888-9999',
    birthday: '1980-05-05',
    gender: 'Male',
    role: 'Admin',
    status: false
  },
  {
    id: '1',
    avatar: 'https://via.placeholder.com/150',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    birthday: '1990-01-01',
    gender: 'Male',
    role: 'Admin',
    status: true
  },
  {
    id: '2',
    avatar: 'https://via.placeholder.com/150',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '098-765-4321',
    birthday: '1992-02-02',
    gender: 'Female',
    role: 'User',
    status: false
  },
  {
    id: '3',
    avatar: 'https://via.placeholder.com/150',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '111-222-3333',
    birthday: '1985-03-03',
    gender: 'Female',
    role: 'User',
    status: true
  },
  {
    id: '4',
    avatar: 'https://via.placeholder.com/150',
    name: 'Bob Brown',
    email: 'bob.brown@example.com',
    phone: '444-555-6666',
    birthday: '1978-04-04',
    gender: 'Male',
    role: 'Moderator',
    status: true
  },
  {
    id: '5',
    avatar: 'https://via.placeholder.com/150',
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    phone: '777-888-9999',
    birthday: '1980-05-05',
    gender: 'Male',
    role: 'Admin',
    status: false
  },
  {
    id: '1',
    avatar: 'https://via.placeholder.com/150',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    birthday: '1990-01-01',
    gender: 'Male',
    role: 'Admin',
    status: true
  },
  {
    id: '2',
    avatar: 'https://via.placeholder.com/150',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '098-765-4321',
    birthday: '1992-02-02',
    gender: 'Female',
    role: 'User',
    status: false
  },
  {
    id: '3',
    avatar: 'https://via.placeholder.com/150',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '111-222-3333',
    birthday: '1985-03-03',
    gender: 'Female',
    role: 'User',
    status: true
  },
  {
    id: '4',
    avatar: 'https://via.placeholder.com/150',
    name: 'Bob Brown',
    email: 'bob.brown@example.com',
    phone: '444-555-6666',
    birthday: '1978-04-04',
    gender: 'Male',
    role: 'Moderator',
    status: true
  },
  {
    id: '5',
    avatar: 'https://via.placeholder.com/150',
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    phone: '777-888-9999',
    birthday: '1980-05-05',
    gender: 'Male',
    role: 'Admin',
    status: false
  },
  {
    id: '1',
    avatar: 'https://via.placeholder.com/150',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    birthday: '1990-01-01',
    gender: 'Male',
    role: 'Admin',
    status: true
  },
  {
    id: '2',
    avatar: 'https://via.placeholder.com/150',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '098-765-4321',
    birthday: '1992-02-02',
    gender: 'Female',
    role: 'User',
    status: false
  },
  {
    id: '3',
    avatar: 'https://via.placeholder.com/150',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '111-222-3333',
    birthday: '1985-03-03',
    gender: 'Female',
    role: 'User',
    status: true
  },
  {
    id: '4',
    avatar: 'https://via.placeholder.com/150',
    name: 'Bob Brown',
    email: 'bob.brown@example.com',
    phone: '444-555-6666',
    birthday: '1978-04-04',
    gender: 'Male',
    role: 'Moderator',
    status: true
  },
  {
    id: '5',
    avatar: 'https://via.placeholder.com/150',
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    phone: '777-888-9999',
    birthday: '1980-05-05',
    gender: 'Male',
    role: 'Admin',
    status: false
  }
]
function ListUser() {
  // const dispatch = useDispatch()
  // useEffect(() => {
  // 	dispatch({
  // 		type: 'users/fetchUsers',
  // 	})
  // }, [dispatch])
  // const users = useSelector((state: RootState) => state.allUser.users)
  return (
    <div className='flex h-full flex-1 flex-col '>
      <h1 className='my-4 border-b pb-2 pt-4 text-3xl font-semibold tracking-wider first:mt-0 '>User Management</h1>
      <DataTable data={users} columns={columns} Toolbar={DataTableToolbar} rowString='user' />
    </div>
  )
}
export default ListUser
