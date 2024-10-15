import studySpace from "@/lib/studySpaceAPI";
import { DashboardAdminProps, DashboardManagerProps } from "@/types";
import { useQuery } from "@tanstack/react-query"
interface StoreDashboard {
    storeName: string;
    totalIncome: number;
    totalBooking: number;
    totalRoom: number;
    totalInThisMonth:TotalInThisMonth;
    monthRevenue: MonthRevenue[];
    popularRooms: PopularRooms[]
  }
  interface TotalInThisMonth{
    totalBookingsInMonth:number;
    totalTransactionsInMonth:number;
    totalRevenueInMonth:number
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

  interface AccountSummary {
    totalAdmins: number;
    totalUsers: number;
    totalStores: number;
    totalAccounts: number;
  }
  
  interface MonthlyIncome {
    month: string; // e.g., "1/2024"
    totalTransactions: number;
    totalAmount: number;
  }
  interface HotBookingStore{
    storeName:string;
    address:string;
    imageURL:string;
    totalBookings:number;
  }
  interface DashboardData {
    accounts: AccountSummary;
    monthlyIncome: MonthlyIncome[];
    totalIncome: number;
    totalTransactions: number;
    totalInThisMonth:TotalInThisMonth;
    totalBookings: number;
    hotBookingStore:HotBookingStore[];
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
    return useQuery<DashboardData>({
        queryKey: ['dashboardAdmin'],
        queryFn: async () => {
            const { data } = await studySpace.get<ApiResponse<DashboardData>>('/Dashboards');
            return data.data;
        }
    })
}