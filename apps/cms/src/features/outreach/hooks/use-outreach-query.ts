import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { outreachService } from '@/lib/api-client'
import type {
  ICreateOutreachContactDto,
  IUpdateOutreachContactDto,
} from '@repo/shared/dtos'

const qk = ['outreach'] as const

export function useOutreachListQuery() {
  return useQuery({
    queryKey: qk,
    queryFn: () => outreachService.list(),
  })
}

export function useOutreachOverdueQuery(enabled: boolean) {
  return useQuery({
    queryKey: [...qk, 'overdue'] as const,
    queryFn: () => outreachService.overdue(),
    enabled,
  })
}

export function useCreateOutreachMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ICreateOutreachContactDto) =>
      outreachService.create(data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk })
      await qc.invalidateQueries({ queryKey: [...qk, 'overdue'] })
    },
  })
}

export function useUpdateOutreachMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: number; data: IUpdateOutreachContactDto }) =>
      outreachService.update(vars.id, vars.data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk })
      await qc.invalidateQueries({ queryKey: [...qk, 'overdue'] })
    },
  })
}
