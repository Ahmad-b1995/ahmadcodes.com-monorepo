import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { format, parseISO } from 'date-fns'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Linkedin, Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { taskService } from '@/lib/api-client'
import { toast } from 'sonner'
import { useCareerDashboardQuery } from './hooks/use-career-dashboard-query'

function formatWhen(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    return format(parseISO(iso), 'MMM d, yyyy')
  } catch {
    return iso
  }
}

function SummaryList(props: {
  title: string
  items: { id: string | number; label: string; sub?: string }[]
  empty: string
}) {
  const { title, items, empty } = props
  return (
    <div className='space-y-2'>
      <p className='text-muted-foreground text-sm font-medium'>{title}</p>
      {items.length === 0 ? (
        <p className='text-muted-foreground text-sm'>{empty}</p>
      ) : (
        <ul className='space-y-1.5 text-sm'>
          {items.slice(0, 8).map((it) => (
            <li key={it.id}>
              <span className='font-medium'>{it.label}</span>
              {it.sub ? (
                <span className='text-muted-foreground'> · {it.sub}</span>
              ) : null}
            </li>
          ))}
          {items.length > 8 ? (
            <li className='text-muted-foreground'>
              +{items.length - 8} more
            </li>
          ) : null}
        </ul>
      )}
    </div>
  )
}

export function Dashboard() {
  const { data, isLoading, error, refetch } = useCareerDashboardQuery()
  const [reminderOpen, setReminderOpen] = useState(false)
  const [reminderTitle, setReminderTitle] = useState('')
  const [reminderDue, setReminderDue] = useState('')
  const [savingReminder, setSavingReminder] = useState(false)

  async function handleSaveReminder() {
    if (!reminderTitle.trim()) {
      toast.error('Title is required')
      return
    }
    if (!reminderDue) {
      toast.error('Pick a due date')
      return
    }
    const due = new Date(reminderDue)
    if (Number.isNaN(due.getTime())) {
      toast.error('Invalid date')
      return
    }
    setSavingReminder(true)
    try {
      await taskService.create({
        type: 'reminder',
        title: reminderTitle.trim(),
        dueAt: due.toISOString(),
        status: 'active',
      })
      toast.success('Reminder created')
      setReminderOpen(false)
      setReminderTitle('')
      setReminderDue('')
      await refetch()
    } catch {
      toast.error('Could not create reminder')
    } finally {
      setSavingReminder(false)
    }
  }

  const summary = data

  const last7Chart =
    summary &&
    [
      {
        name: 'Posts',
        value: summary.last7Days.linkedInPostedCount,
      },
      {
        name: 'Tasks',
        value: summary.last7Days.tasksCompletedCount,
      },
      {
        name: 'Mail out',
        value: summary.last7Days.mailSentCount,
      },
      {
        name: 'Mail in',
        value: summary.last7Days.mailReceivedCount,
      },
    ]

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
            <p className='text-muted-foreground'>
              What you owe today and what happened in the last week.
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Button asChild variant='default'>
              <Link to='/linkedin-posts'>
                <Linkedin className='me-2 size-4' aria-hidden />
                Compose LinkedIn Post
              </Link>
            </Button>
            <Button asChild variant='secondary'>
              <Link to='/outreach'>
                <Users className='me-2 size-4' aria-hidden />
                New Outreach
              </Link>
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => setReminderOpen(true)}
            >
              <Plus className='me-2 size-4' aria-hidden />
              Add Reminder
            </Button>
          </div>
        </div>

        {isLoading ? (
          <p className='text-muted-foreground'>Loading dashboard…</p>
        ) : error ? (
          <p className='text-destructive'>
            Could not load dashboard. Check that you are signed in as an admin.
          </p>
        ) : summary ? (
          <div className='grid gap-4 lg:grid-cols-3'>
            <Card className='lg:col-span-1'>
              <CardHeader>
                <CardTitle>Today</CardTitle>
                <CardDescription>Due and scheduled for today (UTC).</CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <SummaryList
                  title='Tasks (excl. reminders)'
                  empty='No tasks due today.'
                  items={summary.today.tasksDue.map((t) => ({
                    id: t.id,
                    label: t.title,
                    sub: formatWhen(t.dueAt),
                  }))}
                />
                <SummaryList
                  title='LinkedIn scheduled'
                  empty='No posts scheduled today.'
                  items={summary.today.linkedInScheduled.map((p) => ({
                    id: p.id,
                    label: p.title,
                    sub: formatWhen(p.scheduledAt),
                  }))}
                />
                <SummaryList
                  title='Outreach overdue (48h+)'
                  empty='No overdue outreach.'
                  items={summary.today.outreachOverdue.map((c) => ({
                    id: c.id,
                    label: c.name,
                    sub: c.company || undefined,
                  }))}
                />
                <SummaryList
                  title='Reminders'
                  empty='No reminders due today.'
                  items={summary.today.remindersDue.map((t) => ({
                    id: t.id,
                    label: t.title,
                    sub: formatWhen(t.dueAt),
                  }))}
                />
              </CardContent>
            </Card>

            <Card className='lg:col-span-1'>
              <CardHeader>
                <CardTitle>This week</CardTitle>
                <CardDescription>
                  Next 7 days from today (UTC), plus overdue outreach.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <SummaryList
                  title='Tasks (excl. reminders)'
                  empty='No tasks due this week.'
                  items={summary.thisWeek.tasksDue.map((t) => ({
                    id: t.id,
                    label: t.title,
                    sub: formatWhen(t.dueAt),
                  }))}
                />
                <SummaryList
                  title='LinkedIn scheduled'
                  empty='No posts scheduled this week.'
                  items={summary.thisWeek.linkedInScheduled.map((p) => ({
                    id: p.id,
                    label: p.title,
                    sub: formatWhen(p.scheduledAt),
                  }))}
                />
                <SummaryList
                  title='Outreach overdue (48h+)'
                  empty='No overdue outreach.'
                  items={summary.thisWeek.outreachOverdue.map((c) => ({
                    id: c.id,
                    label: c.name,
                    sub: c.company || undefined,
                  }))}
                />
                <SummaryList
                  title='Reminders'
                  empty='No reminders due this week.'
                  items={summary.thisWeek.remindersDue.map((t) => ({
                    id: t.id,
                    label: t.title,
                    sub: formatWhen(t.dueAt),
                  }))}
                />
              </CardContent>
            </Card>

            <Card className='lg:col-span-1'>
              <CardHeader>
                <CardTitle>Last 7 days</CardTitle>
                <CardDescription>Rolling window from now.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <ul className='text-muted-foreground space-y-2 text-sm'>
                  <li>
                    LinkedIn posts marked posted:{' '}
                    <span className='text-foreground font-medium'>
                      {summary.last7Days.linkedInPostedCount}
                    </span>
                  </li>
                  <li>
                    Tasks completed:{' '}
                    <span className='text-foreground font-medium'>
                      {summary.last7Days.tasksCompletedCount}
                    </span>
                  </li>
                  <li>
                    Mail sent:{' '}
                    <span className='text-foreground font-medium'>
                      {summary.last7Days.mailSentCount}
                    </span>
                  </li>
                  <li>
                    Mail received:{' '}
                    <span className='text-foreground font-medium'>
                      {summary.last7Days.mailReceivedCount}
                    </span>
                  </li>
                </ul>
                <div className='h-48 w-full pt-2'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={last7Chart ?? []}>
                      <XAxis dataKey='name' tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} width={32} />
                      <Tooltip />
                      <Bar dataKey='value' fill='var(--color-primary)' radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New reminder</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-2'>
              <div className='grid gap-2'>
                <Label htmlFor='reminder-title'>Title</Label>
                <Input
                  id='reminder-title'
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  placeholder='Call editor…'
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='reminder-due'>Due (local)</Label>
                <Input
                  id='reminder-due'
                  type='datetime-local'
                  value={reminderDue}
                  onChange={(e) => setReminderDue(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setReminderOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type='button'
                onClick={() => void handleSaveReminder()}
                disabled={savingReminder}
              >
                {savingReminder ? 'Saving…' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Main>
    </>
  )
}
