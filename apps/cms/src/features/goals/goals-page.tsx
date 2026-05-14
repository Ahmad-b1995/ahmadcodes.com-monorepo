import { useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { IPlanningGoal, PlanningGoalPriority } from '@repo/shared/dtos'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { goalPlanService } from '@/lib/api-client'

const PRIORITIES: PlanningGoalPriority[] = [
  'critical',
  'high',
  'medium',
  'low',
]

function formatTarget(iso: string | null): string {
  if (!iso) {
    return '—'
  }
  try {
    return format(parseISO(iso), 'MMM d, yyyy')
  } catch {
    return iso
  }
}

function priorityBadgeClass(priority: PlanningGoalPriority): string {
  switch (priority) {
    case 'critical':
      return 'border-destructive/50 bg-destructive/10 text-destructive'
    case 'high':
      return 'border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-300'
    case 'medium':
      return 'border-primary/30 bg-primary/10 text-primary'
    default:
      return 'border-muted-foreground/30 bg-muted text-muted-foreground'
  }
}

export function GoalsPage() {
  const queryClient = useQueryClient()
  const goalsQuery = useQuery({
    queryKey: ['planning-goals'],
    queryFn: () => goalPlanService.list(),
  })

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<IPlanningGoal | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<PlanningGoalPriority>('medium')
  const [targetDate, setTargetDate] = useState('')
  const [active, setActive] = useState(true)

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setPriority('medium')
    setTargetDate('')
    setActive(true)
    setEditing(null)
  }

  const openCreate = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEdit = (g: IPlanningGoal) => {
    setEditing(g)
    setTitle(g.title)
    setDescription(g.description)
    setPriority(g.priority)
    setTargetDate(
      g.targetDate ? g.targetDate.slice(0, 10) : '',
    )
    setActive(g.active)
    setDialogOpen(true)
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!title.trim()) {
        throw new Error('Title is required')
      }
      const payload = {
        title: title.trim(),
        description: description.trim(),
        priority,
        targetDate: targetDate ? `${targetDate}T12:00:00.000Z` : undefined,
        active,
      }
      if (editing) {
        await goalPlanService.update(editing.id, {
          ...payload,
          targetDate: targetDate ? `${targetDate}T12:00:00.000Z` : null,
        })
      } else {
        await goalPlanService.create(payload)
      }
    },
    onSuccess: () => {
      toast.success(editing ? 'Goal updated' : 'Goal created')
      setDialogOpen(false)
      resetForm()
      void queryClient.invalidateQueries({ queryKey: ['planning-goals'] })
    },
    onError: (e: Error) => {
      toast.error(e.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => goalPlanService.delete(id),
    onSuccess: () => {
      toast.success('Goal deleted')
      void queryClient.invalidateQueries({ queryKey: ['planning-goals'] })
    },
  })

  const sorted = useMemo(() => {
    const list = goalsQuery.data ?? []
    const order: Record<PlanningGoalPriority, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    }
    return [...list].sort((a, b) => order[a.priority] - order[b.priority])
  }, [goalsQuery.data])

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

      <Main className='flex flex-1 flex-col gap-6'>
        <div className='mx-auto w-full max-w-3xl space-y-6 px-4 pb-10'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div>
              <h1 className='text-2xl font-semibold tracking-tight'>Goals</h1>
              <p className='text-muted-foreground text-sm'>
                Long-term outcomes the daily planner uses for prioritization.
              </p>
            </div>
            <Button type='button' onClick={openCreate}>
              <Plus className='me-2 size-4' aria-hidden />
              New goal
            </Button>
          </div>

          {goalsQuery.isLoading ? (
            <div className='text-muted-foreground flex items-center gap-2 text-sm'>
              <Loader2 className='size-4 animate-spin' aria-hidden />
              Loading…
            </div>
          ) : null}

          <div className='space-y-3'>
            {sorted.map((g) => (
              <Card key={g.id}>
                <CardHeader className='flex flex-row flex-wrap items-start justify-between gap-2 space-y-0'>
                  <div className='space-y-1'>
                    <CardTitle className='text-base'>{g.title}</CardTitle>
                    <div className='flex flex-wrap items-center gap-2'>
                      <Badge
                        variant='outline'
                        className={priorityBadgeClass(g.priority)}
                      >
                        {g.priority}
                      </Badge>
                      {!g.active ? (
                        <Badge variant='secondary'>Inactive</Badge>
                      ) : null}
                      <span className='text-muted-foreground text-xs'>
                        Target {formatTarget(g.targetDate)}
                      </span>
                    </div>
                    {g.description ? (
                      <CardDescription className='pt-1 text-sm leading-relaxed'>
                        {g.description}
                      </CardDescription>
                    ) : null}
                  </div>
                  <div className='flex gap-1'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      aria-label='Edit goal'
                      onClick={() => openEdit(g)}
                    >
                      <Pencil className='size-4' />
                    </Button>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      aria-label='Delete goal'
                      onClick={() => {
                        if (window.confirm(`Delete goal “${g.title}”?`)) {
                          deleteMutation.mutate(g.id)
                        }
                      }}
                    >
                      <Trash2 className='size-4' />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </Main>

      <Dialog
        open={dialogOpen}
        onOpenChange={(o) => {
          if (!o) {
            setDialogOpen(false)
            resetForm()
          }
        }}
      >
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit goal' : 'New goal'}</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-2'>
            <div className='space-y-2'>
              <Label htmlFor='goal-title'>Title</Label>
              <Input
                id='goal-title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='goal-desc'>Description</Label>
              <Textarea
                id='goal-desc'
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as PlanningGoalPriority)}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='goal-target'>Target date</Label>
              <Input
                id='goal-target'
                type='date'
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
            <div className='flex items-center justify-between gap-4'>
              <Label htmlFor='goal-active'>Active</Label>
              <Switch
                id='goal-active'
                checked={active}
                onCheckedChange={setActive}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                setDialogOpen(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button
              type='button'
              disabled={saveMutation.isPending || !title.trim()}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending ? (
                <Loader2 className='size-4 animate-spin' aria-hidden />
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
