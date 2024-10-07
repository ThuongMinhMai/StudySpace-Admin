import studySpace from "@/lib/studySpaceAPI";
import { DashboardAdminProps, DashboardManagerProps } from "@/types";
import { useQuery } from "@tanstack/react-query"
interface StoreDashboard {
    storeName: string;
    totalIncome: number;
    totalBooking: number;
    totalRoom: number;
    monthRevenue: MonthRevenue[];
    popularRooms: PopularRooms[]
  }
  interface MonthRevenue {
    month: string; // Format: "MM/YYYY"
    transactionInMonth: number;
    revenueInMonth: number;
  }
  interface PopularRooms {
    name:string;
    type:string;
    image:string;
    totalBooking:number
  }
  interface ApiResponse<T> {
    data: T;
  }
export const fetchDashboardStore = (storeId: number) => {
    return useQuery<StoreDashboard>({
        queryKey: ['dashboardManager', storeId],
        queryFn: async () => {
            const { data } = await studySpace.get<ApiResponse<StoreDashboard>>(`/Dashboards/store/${storeId}`);
            return data.data;
        }
    })
}

export const fetchDashboardAdmin = () => {
    return useQuery<DashboardAdminProps>({
        queryKey: ['dashboardAdmin'],
        queryFn: async () => {
            const { data } = await studySpace.get<DashboardAdminProps>('/dashboard-management/managed-dashboards/admins');
            return data;
        }
    })
}