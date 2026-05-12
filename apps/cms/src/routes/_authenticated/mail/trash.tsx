import { createFileRoute } from '@tanstack/react-router'
import { Mail } from '@/features/mail'

export const Route = createFileRoute('/_authenticated/mail/trash')({
  component: () => <Mail folder='trash' />,
})
