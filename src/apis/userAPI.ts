import studySpace from '@/lib/studySpaceAPI';
import { useQuery } from '@tanstack/react-query';
export interface IUserDetail {
  UserID: string;
  UserName: string;
  Password: string;
  FullName: string;
  Email: string;
  Avatar: string;
  Address: string;
  OtpCode: string;
  PhoneNumber: string;
  Balance: number;
  CreateDate: string;
  IsVerified: boolean;
  Status: string;
  RoleID: string;
  RoleName: string;
  CompanyID: string;
}
export interface IStoreDetail {
  id: number;
  thumbnailUrl: string;
  longitude: number;
  latitude: number;
  description: string;
  status: boolean;
  isApproved: boolean;
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  createDate: string;
  openTime: string;
  closeTime: string;
  isOverNight: boolean;
  isActive: boolean;
  taxNumber: string;
  postalNumber: string;
  rooms: IRoomDetail[]; 
  storePackages: IStorePackage[];
  transactions: ITransaction[]; 
  avatarUrl?:string
}

export interface IAdminDetail {
  id: number;
  roleName: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  gender: string;
  dob: string;
  isActive: boolean;
  wallet: number;
  avatarUrl: string;
  thumbnailUrl?:string;
}

interface IRoomDetail {
}

interface IStorePackage {
}

interface ITransaction {
}
interface ApiResponse<T> {
  data: T;
}
export const fetchUserDetail = (userId: number, role: string) => {
  const endpoint = role === 'Admin' 
    ? `/Accounts/detail/${userId}` 
    : `/Stores/detail/${userId}`;

  return useQuery({
    queryKey: ['userDetail', userId, role],
    queryFn: async () => {
      const response = role === 'Admin'
      ? await studySpace.get<ApiResponse<IAdminDetail>>(endpoint)
      : await studySpace.get<ApiResponse<IStoreDetail>>(endpoint);
      
      console.log("User data fetchedd:", response.data.data);
      return  response.data.data;
    },
  });
};

export const updateUserProfile = async (userId: number, role: string, formData: any) => {
  try {
    const endpoint = role === 'Admin' 
      ? `/Accounts/${userId}` 
      : `/Stores/${userId}`;
      
    const response = await studySpace.put(endpoint, formData);
    return response.data; 
  } catch (error) {
    throw new Error('Error updating user profile'); 
  }
};
