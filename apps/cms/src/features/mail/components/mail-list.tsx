import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { IMailMessage, MailStatus } from '@repo/shared/dtos'
import type { MailFolderConfig } from '../data/folders'

type Props = {
  folder: MailFolderConfig
  messages: IMailMessage[]
  selectedId: number | null
  onSelect: (id: number) => void
}

export function MailList({ folder, messages, selectedId, onSelect }: Props) {
  return (
    <ScrollArea className='h-full'>
      <div className='flex flex-col gap-2 p-4 pt-0'>
        {messages.map((message) => {
          const counterparty =
            folder.counterpartyColumn === 'to'
              ? message.toAddresses.join(', ')
              : message.fromAddress
          const isSelected = message.id === selectedId
          const preview = message.bodyText.slice(0, 240)
          const timestamp = new Date(
            message.sentAt ?? message.receivedAt ?? message.createdAt,
          )

          return (
            <button
              key={message.id}
              type='button'
              onClick={() => onSelect(message.id)}
              className={cn(
                'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all',
                'hover:bg-accent',
                isSelected && 'bg-muted border-primary/40',
              )}
            >
              <div className='flex w-full flex-col gap-1'>
                <div className='flex items-center'>
                  <div className='flex items-center gap-2'>
                    <div className='font-semibold'>{counterparty || 'Unknown'}</div>
                  </div>
                  <div
                    className={cn(
                      'ml-auto text-xs',
                      isSelected
                        ? 'text-foreground'
                        : 'text-muted-foreground',
                    )}
                  >
                    {formatDistanceToNow(timestamp, { addSuffix: true })}
                  </div>
                </div>
                <div className='text-xs font-medium'>{message.subject}</div>
              </div>
              <div className='text-muted-foreground line-clamp-2 text-xs'>
                {preview || '\u00a0'}
              </div>
              <StatusPill status={message.status} />
            </button>
          )
        })}
      </div>
      <Separator />
    </ScrollArea>
  )
}

function StatusPill({ status }: { status: MailStatus }) {
  if (status === 'sent') return <Badge variant='secondary'>sent</Badge>
  if (status === 'received') return <Badge>received</Badge>
  if (status === 'queued') return <Badge variant='outline'>queued</Badge>
  return <Badge variant='destructive'>failed</Badge>
}
