import { useAuthenticatedQuery } from "@/frontend/hooks/useAuthenticatedQuery";
import { get } from "@/frontend/http-common";

type JobOrder = {
  id: string;
  employerName: string;
  employmentTitle: string;
}

export const useCoachJobOrders = () => useAuthenticatedQuery(['jobOrders'], ({ token }) => {  
  const getAll = async (token: string) => {
    const res = await get<JobOrder[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/coaches/job_orders`,
      token,
    )

    return res.data
  }

  return getAll(token)
})