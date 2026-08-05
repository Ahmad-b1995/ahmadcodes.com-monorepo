import { useCallback, useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import type { IPlanTask, PlanTaskStatus } from '@repo/shared/dtos'
import {
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Loader2,
  Pencil,
  Pin,
  PinOff,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search } from '@/components/search'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  dailyPlanHttpService,
  memoryNoteHttpService,
  planTaskAdminService,
} from '@/lib/api-client'

function localDateString(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatPlanDate(isoDate: string): string {
  try {
    return format(parseISO(`${isoDate}T12:00:00`), 'EEEE, MMMM d, yyyy')
  } catch {
    return isoDate
  }
}

function priorityClass(priority: string): string {
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

const STATUS_CYCLE: PlanTaskStatus[] = ['todo', 'in_progress', 'done']

function nextStatus(current: PlanTaskStatus): PlanTaskStatus {
  const i = STATUS_CYCLE.indexOf(current)
  if (i === -1) {
    return 'todo'
  }
  return STATUS_CYCLE[(i + 1) % STATUS_CYCLE.length] as PlanTaskStatus
}

function readChecklist(actionable: Record<string, unknown>): string[] {
  const c = actionable.checklist
  if (!Array.isArray(c)) {
    return []
  }
  return c.filter((x): x is string => typeof x === 'string')
}

function readLinks(
  actionable: Record<string, unknown>,
): { label: string; url: string }[] {
  const raw = actionable.links
  if (!Array.isArray(raw)) {
    return []
  }
  return raw.filter((x): x is { label: string; url: string } => {
    if (typeof x !== 'object' || x === null) {
      return false
    }
    const o = x as Record<string, unknown>
    return typeof o.label === 'string' && typeof o.url === 'string'
  }) as { label: string; url: string }[]
}

function readCopyText(actionable: Record<string, unknown>): string {
  return typeof actionable.copyText === 'string' ? actionable.copyText : ''
}

export function TodayPage() {
  const queryClient = useQueryClient()
  const planDate = useMemo(() => localDateString(new Date()), [])

  const planQuery = useQuery({
    queryKey: ['daily-plan', planDate],
    queryFn: () => dailyPlanHttpService.get({ date: planDate }),
  })

  const memoryQuery = useQuery({
    queryKey: ['memory-notes', 1],
    queryFn: () =>
      memoryNoteHttpService.list({ page: 1, limit: 30 }),
  })

  const regenerateMutation = useMutation({
    mutationFn: () =>
      dailyPlanHttpService.generate({ date: planDate }),
    onSuccess: () => {
      toast.success('Plan regenerated')
      void queryClient.invalidateQueries({ queryKey: ['daily-plan', planDate] })
    },
  })

  const addMemoryMutation = useMutation({
    mutationFn: (content: string) =>
      memoryNoteHttpService.create({
        content,
        tags: ['manual', 'today-page'],
      }),
    onSuccess: () => {
      toast.success('Saved to memory')
      void queryClient.invalidateQueries({ queryKey: ['memory-notes'] })
    },
  })

  const [memoryInput, setMemoryInput] = useState('')
  const [rationaleOpen, setRationaleOpen] = useState(false)
  const [editNote, setEditNote] = useState<{
    id: number
    content: string
  } | null>(null)

  const updateTaskStatus = useCallback(
    async (task: IPlanTask, status: PlanTaskStatus) => {
      await planTaskAdminService.update(task.id, {
        status,
        completedAt: status === 'done' ? new Date().toISOString() : null,
      })
      void queryClient.invalidateQueries({ queryKey: ['daily-plan', planDate] })
    },
    [planDate, queryClient],
  )

  const cycleStatus = useCallback(
    async (task: IPlanTask) => {
      const next = nextStatus(task.status)
      await updateTaskStatus(task, next)
      toast.success(`Status: ${next.replace('_', ' ')}`)
    },
    [updateTaskStatus],
  )

  const markDone = useCallback(
    async (task: IPlanTask) => {
      await updateTaskStatus(task, 'done')
      toast.success('Marked done')
    },
    [updateTaskStatus],
  )

  const feedbackMutation = useMutation({
    mutationFn: dailyPlanHttpService.feedback.bind(dailyPlanHttpService),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['daily-plan', planDate] })
      void queryClient.invalidateQueries({ queryKey: ['memory-notes'] })
    },
  })

  const bundle = planQuery.data
  const planId = bundle?.plan.id

  const handleDefer = (task: IPlanTask) => {
    if (!planId) {
      return
    }
    feedbackMutation.mutate(
      {
        planId,
        freeText: `Deferred task #${task.id}: ${task.title}`,
        action: 'defer-task',
        taskId: task.id,
      },
      { onSuccess: () => toast.success('Task deferred') },
    )
  }

  const handleDeleteForever = (task: IPlanTask) => {
    if (!planId) {
      return
    }
    if (!window.confirm(`Permanently delete “${task.title}”?`)) {
      return
    }
    feedbackMutation.mutate(
      {
        planId,
        freeText: `Deleted forever task #${task.id}: ${task.title}`,
        action: 'delete-task-forever',
        taskId: task.id,
      },
      { onSuccess: () => toast.success('Task removed') },
    )
  }

  const handleAddContext = (task: IPlanTask, text: string) => {
    if (!planId || !text.trim()) {
      return
    }
    feedbackMutation.mutate(
      {
        planId,
        freeText: `Context for task #${task.id} (${task.title}):\n${text.trim()}`,
        action: 'save-context',
      },
      {
        onSuccess: () => toast.success('Context saved'),
      },
    )
  }

  const copyActionable = async (actionable: Record<string, unknown>) => {
    const text = readCopyText(actionable)
    if (!text) {
      toast.error('Nothing to copy')
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied')
    } catch {
      toast.error('Clipboard not available')
    }
  }

  const memoryItems = memoryQuery.data?.items ?? []

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
        <div className='mx-auto w-full max-w-[900px] space-y-6 px-4 pb-10'>
          <div className='space-y-1'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Today —{' '}
              {bundle
                ? formatPlanDate(bundle.plan.planDate)
                : formatPlanDate(planDate)}
            </h1>
            {bundle ? (
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {bundle.plan.summary}
              </p>
            ) : planQuery.isLoading ? (
              <p className='text-muted-foreground text-sm'>Loading plan…</p>
            ) : (
              <p className='text-destructive text-sm'>
                {planQuery.error instanceof Error
                  ? planQuery.error.message
                  : 'Could not load plan'}
              </p>
            )}
          </div>

          <Button
            type='button'
            size='lg'
            className='w-full sm:w-auto'
            disabled={regenerateMutation.isPending}
            onClick={() => regenerateMutation.mutate()}
          >
            {regenerateMutation.isPending ? (
              <Loader2 className='me-2 size-4 animate-spin' aria-hidden />
            ) : (
              <Sparkles className='me-2 size-4' aria-hidden />
            )}
            Regenerate plan
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Memory</CardTitle>
              <CardDescription>
                Notes the planner remembers for future days.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Textarea
                placeholder='Visa appointment moved to June…'
                value={memoryInput}
                onChange={(e) => setMemoryInput(e.target.value)}
                rows={4}
              />
              <Button
                type='button'
                disabled={!memoryInput.trim() || addMemoryMutation.isPending}
                onClick={() => {
                  addMemoryMutation.mutate(memoryInput.trim(), {
                    onSuccess: () => setMemoryInput(''),
                  })
                }}
              >
                Add to memory
              </Button>
              <Separator />
              <ScrollArea className='h-48 pr-3'>
                <ul className='space-y-3'>
                  {memoryItems.map((note) => (
                    <li
                      key={note.id}
                      className='bg-muted/40 rounded-md border p-3 text-sm'
                    >
                      <p className='whitespace-pre-wrap'>{note.content}</p>
                      <div className='mt-2 flex flex-wrap gap-2'>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          aria-label={note.pinned ? 'Unpin' : 'Pin'}
                          onClick={async () => {
                            await memoryNoteHttpService.update(note.id, {
                              pinned: !note.pinned,
                            })
                            void queryClient.invalidateQueries({
                              queryKey: ['memory-notes'],
                            })
                          }}
                        >
                          {note.pinned ? (
                            <PinOff className='size-4' />
                          ) : (
                            <Pin className='size-4' />
                          )}
                        </Button>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          aria-label='Edit memory'
                          onClick={() =>
                            setEditNote({ id: note.id, content: note.content })
                          }
                        >
                          <Pencil className='size-4' />
                        </Button>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          aria-label='Delete memory'
                          onClick={async () => {
                            if (!window.confirm('Delete this memory note?')) {
                              return
                            }
                            await memoryNoteHttpService.delete(note.id)
                            void queryClient.invalidateQueries({
                              queryKey: ['memory-notes'],
                            })
                            toast.success('Deleted')
                          }}
                        >
                          <Trash2 className='size-4' />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className='space-y-4'>
            <h2 className='text-lg font-medium'>Tasks</h2>
            {planQuery.isLoading ? (
              <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                <Loader2 className='size-4 animate-spin' aria-hidden />
                Loading…
              </div>
            ) : null}
            {bundle?.tasks.map((task) => (
              <TaskPlanCard
                key={task.id}
                task={task}
                planId={planId}
                onCycleStatus={() => void cycleStatus(task)}
                onMarkDone={() => void markDone(task)}
                onCopy={() => void copyActionable(task.actionable)}
                onDefer={() => handleDefer(task)}
                onDelete={() => handleDeleteForever(task)}
                onAddContext={(text) => handleAddContext(task, text)}
                feedbackBusy={feedbackMutation.isPending}
              />
            ))}
          </div>

          {bundle ? (
            <Collapsible open={rationaleOpen} onOpenChange={setRationaleOpen}>
              <CollapsibleTrigger asChild>
                <Button variant='ghost' className='gap-1 px-0'>
                  {rationaleOpen ? (
                    <ChevronDown className='size-4' aria-hidden />
                  ) : (
                    <ChevronRight className='size-4' aria-hidden />
                  )}
                  AI rationale
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <p className='text-muted-foreground mt-2 whitespace-pre-wrap text-sm leading-relaxed'>
                  {bundle.plan.rationale}
                </p>
              </CollapsibleContent>
            </Collapsible>
          ) : null}
        </div>
      </Main>

      <Dialog
        open={editNote != null}
        onOpenChange={(o) => {
          if (!o) {
            setEditNote(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit memory</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editNote?.content ?? ''}
            onChange={(e) =>
              setEditNote((prev) =>
                prev ? { ...prev, content: e.target.value } : prev,
              )
            }
            rows={6}
          />
          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => setEditNote(null)}>
              Cancel
            </Button>
            <Button
              type='button'
              disabled={!editNote?.content.trim()}
              onClick={async () => {
                if (!editNote) {
                  return
                }
                await memoryNoteHttpService.update(editNote.id, {
                  content: editNote.content.trim(),
                })
                setEditNote(null)
                void queryClient.invalidateQueries({ queryKey: ['memory-notes'] })
                toast.success('Updated')
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function TaskPlanCard(props: {
  task: IPlanTask
  planId: number | undefined
  onCycleStatus: () => void
  onMarkDone: () => void
  onCopy: () => void
  onDefer: () => void
  onDelete: () => void
  onAddContext: (text: string) => void
  feedbackBusy: boolean
}) {
  const {
    task,
    planId,
    onCycleStatus,
    onMarkDone,
    onCopy,
    onDefer,
    onDelete,
    onAddContext,
    feedbackBusy,
  } = props
  const [open, setOpen] = useState(false)
  const [ctxOpen, setCtxOpen] = useState(false)
  const [ctxText, setCtxText] = useState('')
  const actionable = task.actionable
  const checklist = readChecklist(actionable)
  const links = readLinks(actionable)

  return (
    <Card>
      <CardHeader className='space-y-3'>
        <div className='flex flex-wrap items-start justify-between gap-2'>
          <div className='space-y-1'>
            <CardTitle className='text-base leading-snug'>{task.title}</CardTitle>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge
                variant='outline'
                className={priorityClass(task.priority)}
              >
                {task.priority}
              </Badge>
              {task.estimatedMinutes != null ? (
                <span className='text-muted-foreground text-xs'>
                  ~{task.estimatedMinutes} min
                </span>
              ) : null}
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type='button'
                className='text-muted-foreground hover:text-foreground border-border rounded-md border px-2 py-1 text-xs font-medium capitalize'
                onClick={onCycleStatus}
              >
                {task.status.replace('_', ' ')}
              </button>
            </TooltipTrigger>
            <TooltipContent>Click to cycle status</TooltipContent>
          </Tooltip>
        </div>
        {task.description ? (
          <CardDescription className='text-sm leading-relaxed'>
            {task.description}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex flex-wrap gap-2'>
          <Button type='button' size='sm' onClick={onMarkDone}>
            Mark done
          </Button>
          <Button
            type='button'
            size='sm'
            variant='secondary'
            disabled={!planId || feedbackBusy}
            onClick={onDefer}
          >
            Defer
          </Button>
          <Button
            type='button'
            size='sm'
            variant='destructive'
            disabled={!planId || feedbackBusy}
            onClick={onDelete}
          >
            Delete forever
          </Button>
          <Button
            type='button'
            size='sm'
            variant='outline'
            disabled={!planId || feedbackBusy}
            onClick={() => setCtxOpen((v) => !v)}
          >
            Add context
          </Button>
        </div>
        {ctxOpen ? (
          <div className='space-y-2'>
            <Textarea
              rows={3}
              value={ctxText}
              onChange={(e) => setCtxText(e.target.value)}
              placeholder='Anything the planner should know about this task…'
            />
            <Button
              type='button'
              size='sm'
              disabled={!ctxText.trim() || feedbackBusy}
              onClick={() => {
                onAddContext(ctxText)
                setCtxText('')
                setCtxOpen(false)
              }}
            >
              Save context
            </Button>
          </div>
        ) : null}

        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <Button variant='ghost' size='sm' className='gap-1 px-0'>
              {open ? (
                <ChevronDown className='size-4' aria-hidden />
              ) : (
                <ChevronRight className='size-4' aria-hidden />
              )}
              Actionable steps
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className='space-y-3 pt-2'>
            {checklist.length > 0 ? (
              <ol className='list-decimal space-y-1 ps-5 text-sm'>
                {checklist.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            ) : (
              <p className='text-muted-foreground text-sm'>No checklist items.</p>
            )}
            <Button type='button' variant='outline' size='sm' onClick={onCopy}>
              <Copy className='me-2 size-4' aria-hidden />
              Copy text
            </Button>
            {links.length > 0 ? (
              <ul className='space-y-1 text-sm'>
                {links.map((link) => (
                  <li key={link.url + link.label}>
                    <a
                      href={link.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-primary inline-flex items-center gap-1 hover:underline'
                    >
                      {link.label}
                      <ExternalLink className='size-3' aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
