import { useQuery } from '@tanstack/react-query'
import type { ICareerSummary } from '@repo/shared/dtos'
import { dashboardService } from '@/lib/api-client'

export function useCareerDashboardQuery() {
  return useQuery({
    queryKey: ['dashboard', 'career-summary'],
    queryFn: (): Promise<ICareerSummary> =>
      dashboardService.getCareerSummary(),
  })
}
