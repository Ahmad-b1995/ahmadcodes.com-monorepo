import { Archive, Reply, ReplyAll, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  useDeleteMailMutation,
  useMailDetailQuery,
} from '../hooks/use-mail-query'
import type { IMailMessage } from '@repo/shared/dtos'

type Props = {
  selectedId: number | null
  onReply?: (message: IMailMessage) => void
  onCleared?: () => void
}

export function MailDetailPanel({ selectedId, onReply, onCleared }: Props) {
  const { data, isLoading } = useMailDetailQuery(selectedId)
  const deleteMutation = useDeleteMailMutation()

  if (selectedId === null) {
    return (
      <div className='text-muted-foreground flex h-full items-center justify-center p-8 text-center text-sm'>
        Select a message to view it.
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className='text-muted-foreground flex h-full items-center justify-center text-sm'>
        Loading…
      </div>
    )
  }

  const initials = data.fromAddress
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div className='flex h-full flex-col'>
      <div className='flex items-center p-2'>
        <div className='flex items-center gap-2'>
          {data.direction === 'received' && onReply && (
            <>
              <ToolbarAction label='Reply' onClick={() => onReply(data)}>
                <Reply className='size-4' />
              </ToolbarAction>
              <ToolbarAction label='Reply all' onClick={() => onReply(data)}>
                <ReplyAll className='size-4' />
              </ToolbarAction>
            </>
          )}
          <ToolbarAction label='Archive' disabled>
            <Archive className='size-4' />
          </ToolbarAction>
          <ToolbarAction
            label='Delete'
            onClick={async () => {
              await deleteMutation.mutateAsync(data.id)
              onCleared?.()
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className='size-4' />
          </ToolbarAction>
        </div>
      </div>
      <Separator />
      <div className='flex flex-1 flex-col'>
        <div className='flex items-start p-4'>
          <div className='flex items-start gap-4 text-sm'>
            <Avatar>
              <AvatarFallback>{initials || '?'}</AvatarFallback>
            </Avatar>
            <div className='grid gap-1'>
              <div className='font-semibold'>{data.fromAddress}</div>
              <div className='line-clamp-1 text-xs'>{data.subject}</div>
              <div className='line-clamp-1 text-xs'>
                <span className='text-muted-foreground'>To: </span>
                {data.toAddresses.join(', ')}
              </div>
              {data.ccAddresses.length > 0 && (
                <div className='text-muted-foreground line-clamp-1 text-xs'>
                  CC: {data.ccAddresses.join(', ')}
                </div>
              )}
            </div>
          </div>
          <div className='text-muted-foreground ml-auto text-xs'>
            {new Date(
              data.sentAt ?? data.receivedAt ?? data.createdAt,
            ).toLocaleString()}
          </div>
        </div>
        <Separator />
        <div className='flex-1 overflow-y-auto p-4'>
          {data.error && (
            <div className='border-destructive/30 bg-destructive/5 text-destructive mb-4 rounded-md border p-3 text-sm'>
              <div className='font-medium'>Send error</div>
              <div className='mt-1 whitespace-pre-wrap text-xs'>{data.error}</div>
            </div>
          )}
          <article
            className='prose prose-sm dark:prose-invert max-w-none'
            dangerouslySetInnerHTML={{ __html: data.bodyHtml }}
          />
        </div>
      </div>
    </div>
  )
}

function ToolbarAction({
  label,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='ghost' size='icon' aria-label={label} {...props}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
