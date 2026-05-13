import { createFileRoute } from '@tanstack/react-router'
import { Outreach } from '@/features/outreach'

export const Route = createFileRoute('/_authenticated/outreach/')({
  component: Outreach,
})
