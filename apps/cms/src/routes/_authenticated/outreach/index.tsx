import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/outreach/')({
  component: function OutreachPlaceholder() {
    return (
      <div className='text-muted-foreground p-6 text-sm'>
        Outreach — table and forms load on this route.
      </div>
    )
  },
})
