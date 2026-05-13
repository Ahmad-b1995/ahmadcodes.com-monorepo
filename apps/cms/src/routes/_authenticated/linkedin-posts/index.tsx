import { createFileRoute } from '@tanstack/react-router'
import { LinkedInPosts } from '@/features/linkedin-posts'

export const Route = createFileRoute('/_authenticated/linkedin-posts/')({
  component: LinkedInPosts,
})
