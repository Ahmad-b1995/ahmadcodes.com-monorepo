import { useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import type { IOutreachContact } from '@repo/shared/dtos'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { OutreachDetailDialog } from './components/outreach-detail-dialog'
import { OutreachFormDialog } from './components/outreach-form-dialog'
import {
  useOutreachListQuery,
  useOutreachOverdueQuery,
} from './hooks/use-outreach-query'

function statusBadgeVariant(
  status: IOutreachContact['status'],
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'queued':
      return 'outline'
    case 'contacted':
      return 'secondary'
    case 'responded':
      return 'default'
    case 'booked':
      return 'default'
    case 'closed':
      return 'destructive'
    default:
      return 'outline'
  }
}

function formatDt(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    return format(parseISO(iso), 'MMM d, yyyy HH:mm')
  } catch {
    return '—'
  }
}

export function Outreach() {
  const [overdueOnly, setOverdueOnly] = useState(false)
  const { data: allRows, isLoading: loadingAll, error: errAll } =
    useOutreachListQuery()
  const { data: overdueRows, isLoading: loadingOd, error: errOd } =
    useOutreachOverdueQuery(overdueOnly)

  const rows = overdueOnly ? (overdueRows ?? []) : (allRows ?? [])
  const isLoading = overdueOnly ? loadingOd : loadingAll
  const error = overdueOnly ? errOd : errAll

  const [formOpen, setFormOpen] = useState(false)
  const [formContact, setFormContact] = useState<IOutreachContact | null>(null)
  const [detailContact, setDetailContact] = useState<IOutreachContact | null>(
    null,
  )

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
      const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
      return tb - ta
    })
  }, [rows])

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
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Outreach</h1>
            <p className='text-muted-foreground'>
              Contacts, follow-ups, and pipeline status.
            </p>
          </div>
          <Button
            type='button'
            onClick={() => {
              setFormContact(null)
              setFormOpen(true)
            }}
          >
            <Plus className='me-2 size-4' aria-hidden />
            Add contact
          </Button>
        </div>

        <div className='mb-4 flex items-center gap-2'>
          <Checkbox
            id='overdue-filter'
            checked={overdueOnly}
            onCheckedChange={(v) => setOverdueOnly(v === true)}
          />
          <Label htmlFor='overdue-filter' className='cursor-pointer font-normal'>
            Overdue only (contacted, no reply, 48h+ since last contact)
          </Label>
        </div>

        {isLoading ? (
          <p className='text-muted-foreground'>Loading…</p>
        ) : error ? (
          <p className='text-destructive'>Could not load contacts.</p>
        ) : (
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last contacted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className='text-muted-foreground h-24 text-center'>
                      No contacts{overdueOnly ? ' match overdue filter' : ''}.
                    </TableCell>
                  </TableRow>
                ) : (
                  sorted.map((c) => (
                    <TableRow
                      key={c.id}
                      className='cursor-pointer'
                      role='button'
                      tabIndex={0}
                      aria-label={`Open ${c.name}`}
                      onClick={() => setDetailContact(c)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setDetailContact(c)
                        }
                      }}
                    >
                      <TableCell className='font-medium'>{c.name}</TableCell>
                      <TableCell>{c.company || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant(c.status)}>
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDt(c.lastContactedAt)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <OutreachFormDialog
          open={formOpen}
          onOpenChange={(o) => {
            setFormOpen(o)
            if (!o) setFormContact(null)
          }}
          contact={formContact}
        />

        <OutreachDetailDialog
          contact={detailContact}
          open={detailContact !== null}
          onOpenChange={(o) => {
            if (!o) setDetailContact(null)
          }}
          onEdit={(c) => {
            setDetailContact(null)
            setFormContact(c)
            setFormOpen(true)
          }}
        />
      </Main>
    </>
  )
}
