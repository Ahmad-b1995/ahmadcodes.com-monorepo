import { useState } from 'react'
import { Mail as MailIcon, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  useDeleteMailMutation,
  useMailListQuery,
  useVerifySmtpMutation,
} from './hooks/use-mail-query'
import { MailComposeDialog } from './components/mail-compose-dialog'
import { MailDetailDialog } from './components/mail-detail-dialog'
import type { IMailMessage, MailDirection } from '@repo/shared/dtos'

export function Mail() {
  const [composeOpen, setComposeOpen] = useState(false)
  const [detailId, setDetailId] = useState<number | null>(null)
  const [direction, setDirection] = useState<MailDirection>('sent')

  const list = useMailListQuery({ direction, page: 1, limit: 50 })
  const verifyMutation = useVerifySmtpMutation()
  const deleteMutation = useDeleteMailMutation()

  const messages = list.data?.items ?? []

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between gap-2'>
          <div>
            <h2 className='flex items-center gap-2 text-2xl font-bold tracking-tight'>
              <MailIcon className='size-6' /> Mail
            </h2>
            <p className='text-muted-foreground'>
              Send mail from your branded address. SMTP via the configured
              relay.
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => verifyMutation.mutate()}
              disabled={verifyMutation.isPending}
            >
              <RefreshCw
                className={`size-4 ${verifyMutation.isPending ? 'animate-spin' : ''}`}
              />
              Verify SMTP
            </Button>
            <Button onClick={() => setComposeOpen(true)}>
              <Plus className='size-4' />
              Compose
            </Button>
          </div>
        </div>

        <Tabs
          value={direction}
          onValueChange={(value) => setDirection(value as MailDirection)}
          className='mt-4'
        >
          <TabsList>
            <TabsTrigger value='sent'>Sent</TabsTrigger>
            <TabsTrigger value='received'>Received</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className='mt-4'>
          {list.isLoading ? (
            <div className='text-muted-foreground py-8 text-center'>
              Loading...
            </div>
          ) : list.error ? (
            <div className='text-destructive py-8 text-center'>
              Failed to load mail.
            </div>
          ) : messages.length === 0 ? (
            <EmptyState
              direction={direction}
              onCompose={() => setComposeOpen(true)}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[140px]'>Date</TableHead>
                  <TableHead className='w-[110px]'>Status</TableHead>
                  <TableHead>
                    {direction === 'sent' ? 'To' : 'From'}
                  </TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className='w-[80px]'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <MailRow
                    key={message.id}
                    message={message}
                    onOpen={() => setDetailId(message.id)}
                    onDelete={() => deleteMutation.mutate(message.id)}
                    deleting={deleteMutation.isPending}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Main>

      <MailComposeDialog
        open={composeOpen}
        onOpenChange={setComposeOpen}
      />
      <MailDetailDialog
        id={detailId}
        onOpenChange={(open) => {
          if (!open) setDetailId(null)
        }}
      />
    </>
  )
}

function MailRow({
  message,
  onOpen,
  onDelete,
  deleting,
}: {
  message: IMailMessage
  onOpen: () => void
  onDelete: () => void
  deleting: boolean
}) {
  const counterparty =
    message.direction === 'sent'
      ? message.toAddresses.join(', ')
      : message.fromAddress
  const date = new Date(
    message.sentAt ?? message.receivedAt ?? message.createdAt,
  )
  return (
    <TableRow className='cursor-pointer' onClick={onOpen}>
      <TableCell className='text-muted-foreground text-xs whitespace-nowrap'>
        {date.toLocaleDateString()}{' '}
        <span className='ms-1 opacity-60'>
          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </TableCell>
      <TableCell>
        <StatusBadge status={message.status} />
      </TableCell>
      <TableCell className='max-w-[260px] truncate'>{counterparty}</TableCell>
      <TableCell className='max-w-[480px] truncate font-medium'>
        {message.subject}
      </TableCell>
      <TableCell className='text-end'>
        <Button
          variant='ghost'
          size='icon'
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          disabled={deleting}
          title='Delete'
        >
          <Trash2 className='size-4' />
        </Button>
      </TableCell>
    </TableRow>
  )
}

function StatusBadge({ status }: { status: IMailMessage['status'] }) {
  if (status === 'sent') return <Badge variant='secondary'>sent</Badge>
  if (status === 'received') return <Badge>received</Badge>
  if (status === 'queued') return <Badge variant='outline'>queued</Badge>
  return <Badge variant='destructive'>failed</Badge>
}

function EmptyState({
  direction,
  onCompose,
}: {
  direction: MailDirection
  onCompose: () => void
}) {
  return (
    <div className='text-muted-foreground flex flex-col items-center justify-center gap-3 rounded-md border border-dashed py-16'>
      <MailIcon className='size-8' />
      <p className='text-sm'>
        {direction === 'sent'
          ? 'No sent mail yet.'
          : 'No received mail yet. Inbound is wired separately (Cloudflare Worker → /mail/inbound webhook). See REMINDERS.md.'}
      </p>
      {direction === 'sent' && (
        <Button onClick={onCompose}>
          <Plus className='size-4' />
          Send your first email
        </Button>
      )}
    </div>
  )
}
