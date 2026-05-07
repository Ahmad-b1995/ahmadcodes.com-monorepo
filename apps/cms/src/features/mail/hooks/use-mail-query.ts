import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { mailService } from '@/lib/api-client'
import type {
  IMailListFilters,
  ISendMailDto,
} from '@repo/shared/dtos'

const MAIL_QUERY_KEY = 'mail'

export function useMailListQuery(filters?: IMailListFilters) {
  return useQuery({
    queryKey: [MAIL_QUERY_KEY, filters],
    queryFn: () => mailService.list(filters),
    refetchInterval: 30_000,
  })
}

export function useMailDetailQuery(id: number | null) {
  return useQuery({
    queryKey: [MAIL_QUERY_KEY, 'detail', id],
    queryFn: () => mailService.findOne(id as number),
    enabled: id !== null,
  })
}

export function useSendMailMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ISendMailDto) => mailService.send(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MAIL_QUERY_KEY] })
      toast.success('Mail sent')
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to send mail'
      toast.error(message)
    },
  })
}

export function useDeleteMailMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => mailService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MAIL_QUERY_KEY] })
      toast.success('Mail deleted')
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete'
      toast.error(message)
    },
  })
}

export function useVerifySmtpMutation() {
  return useMutation({
    mutationFn: () => mailService.verify(),
    onSuccess: (result) => {
      toast.success(`SMTP OK (${result.host})`)
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'SMTP verification failed'
      toast.error(message)
    },
  })
}
