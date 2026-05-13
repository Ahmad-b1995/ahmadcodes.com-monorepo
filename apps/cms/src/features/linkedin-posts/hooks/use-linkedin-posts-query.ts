import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { linkedInPostService } from '@/lib/api-client'
import type {
  ICreateLinkedInPostDto,
  ILinkedInPost,
  IUpdateLinkedInPostDto,
} from '@repo/shared/dtos'

const qk = ['linkedin-posts'] as const

export function useLinkedInPostsQuery() {
  return useQuery({
    queryKey: qk,
    queryFn: () => linkedInPostService.list(),
  })
}

export function useCreateLinkedInPostMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ICreateLinkedInPostDto) =>
      linkedInPostService.create(data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk })
    },
  })
}

export function useUpdateLinkedInPostMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: number; data: IUpdateLinkedInPostDto }) =>
      linkedInPostService.update(vars.id, vars.data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk })
    },
  })
}

export function useMarkLinkedInPostedMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: number; externalUrl?: string }) =>
      linkedInPostService.markPosted(vars.id, {
        externalUrl: vars.externalUrl,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk })
    },
  })
}

export function tabForPost(post: ILinkedInPost): 'drafts' | 'scheduled' | 'posted' {
  if (post.postedAt) return 'posted'
  if (post.scheduledAt) return 'scheduled'
  return 'drafts'
}
