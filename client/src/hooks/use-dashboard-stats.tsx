import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

export interface DashboardStats {
  borrowedCount: number;
  dueSoonCount: number;
  reservationCount: number;
  availableReservations: number;
  overdueCount: number;
  totalBookCount: number;
  popularCategoryCount: number;
  popularCategory?: string;
}

export function useDashboardStats() {
  const { user } = useAuth();
  
  const { data, isLoading, error, refetch } = useQuery<DashboardStats>({
    queryKey: ["/api/user/dashboard/stats"],
    enabled: !!user,
    refetchInterval: 5000, // Refetch every 5 seconds to keep stats updated
    staleTime: 1000, // Consider data stale after 1 second
  });
  
  return {
    stats: data || {
      borrowedCount: 0,
      dueSoonCount: 0,
      reservationCount: 0,
      availableReservations: 0,
      overdueCount: 0,
      totalBookCount: 0,
      popularCategoryCount: 0,
    },
    isLoading,
    error,
    refetch,
  };
}