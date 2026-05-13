import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/linkedin-posts/')({
  component: function LinkedInPostsPlaceholder() {
    return (
      <div className='text-muted-foreground p-6 text-sm'>
        LinkedIn posts — full composer opens here from the dashboard link.
      </div>
    )
  },
})
