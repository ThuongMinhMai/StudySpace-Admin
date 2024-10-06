import studySpace from "@/lib/studySpaceAPI";
import { DashboardAdminProps, DashboardManagerProps } from "@/types";
import { useQuery } from "@tanstack/react-query"

export const fetchDashboardManager = (CompanyID: number) => {
    return useQuery<DashboardManagerProps>({
        queryKey: ['dashboardManager', CompanyID],
        queryFn: async () => {
            const { data } = await studySpace.get<DashboardManagerProps>(`/dashboard-management/managed-dashboards/company/${CompanyID}`);
            return data;
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