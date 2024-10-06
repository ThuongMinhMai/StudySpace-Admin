import { Staff } from "@/components/global/organisms/StaffList/columns";
import studySpace from "@/lib/studySpaceAPI";
import { useQuery } from "@tanstack/react-query";

export const fetchStaff = (CompanyID: string) => {
    return useQuery<Staff[]>({
        queryKey: ['staff'],
        queryFn: async () => {
            const { data } = await studySpace.get<Staff[]>(`user-management/managed-users/staff/${CompanyID}`);
            return data;
        }
    })
}
