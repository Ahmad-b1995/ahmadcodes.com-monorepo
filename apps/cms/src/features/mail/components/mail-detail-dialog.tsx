import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useMailDetailQuery } from '../hooks/use-mail-query'
import type { IMailMessage } from '@repo/shared/dtos'

type Props = {
  id: number | null
  onOpenChange: (open: boolean) => void
  onReply?: (message: IMailMessage) => void
}

export function MailDetailDialog({ id, onOpenChange, onReply }: Props) {
  const { data, isLoading } = useMailDetailQuery(id)

  return (
    <Dialog open={id !== null} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[92vh] flex-col gap-0 p-0 sm:max-w-3xl'>
        <DialogHeader className='border-b px-6 py-4 text-start'>
          <DialogTitle>{data?.subject ?? 'Mail'}</DialogTitle>
          <DialogDescription>
            {data ? (
              <span className='flex flex-wrap items-center gap-2 pt-1'>
                <Badge variant='secondary'>{data.direction}</Badge>
                <Badge
                  variant={data.status === 'failed' ? 'destructive' : 'outline'}
                >
                  {data.status}
                </Badge>
                <span className='text-muted-foreground text-xs'>
                  {new Date(data.sentAt ?? data.createdAt).toLocaleString()}
                </span>
              </span>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        <div className='min-h-0 flex-1 overflow-y-auto px-6 py-4'>
          {isLoading || !data ? (
            <div className='text-muted-foreground py-8 text-center'>
              Loading...
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='text-sm'>
                <div>
                  <span className='text-muted-foreground'>From: </span>
                  {data.fromAddress}
                </div>
                <div>
                  <span className='text-muted-foreground'>To: </span>
                  {data.toAddresses.join(', ')}
                </div>
                {data.ccAddresses.length > 0 && (
                  <div>
                    <span className='text-muted-foreground'>CC: </span>
                    {data.ccAddresses.join(', ')}
                  </div>
                )}
                {data.bccAddresses.length > 0 && (
                  <div>
                    <span className='text-muted-foreground'>BCC: </span>
                    {data.bccAddresses.join(', ')}
                  </div>
                )}
              </div>
              <Separator />
              {data.error && (
                <div className='border-destructive/30 bg-destructive/5 text-destructive rounded-md border p-3 text-sm'>
                  <div className='font-medium'>Send error</div>
                  <div className='mt-1 whitespace-pre-wrap text-xs'>
                    {data.error}
                  </div>
                </div>
              )}
              <article
                className='prose prose-sm dark:prose-invert max-w-none'
                dangerouslySetInnerHTML={{ __html: data.bodyHtml }}
              />
            </div>
          )}
        </div>

        <DialogFooter className='border-t px-6 py-4'>
          {data && onReply && data.direction === 'received' && (
            <Button variant='outline' onClick={() => onReply(data)}>
              Reply
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
