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
}

export function useDashboardStats() {
  const { user } = useAuth();
  
  const { data, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ["/api/user/dashboard/stats"],
    enabled: !!user,
    // Default to mock stats while the API is being developed
    placeholderData: {
      borrowedCount: 2,
      dueSoonCount: 1,
      reservationCount: 1,
      availableReservations: 0,
      overdueCount: 0,
      totalBookCount: 0,
      popularCategoryCount: 0,
    },
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
  };
}