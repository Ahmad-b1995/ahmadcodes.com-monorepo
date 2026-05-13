import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ILinkedInPost } from '@repo/shared/dtos'
import { format, parseISO } from 'date-fns'
import { useMarkLinkedInPostedMutation } from '../hooks/use-linkedin-posts-query'
import { htmlToLinkedInPlain } from '../lib/html-to-linkedin-plain'
import { toast } from 'sonner'

type PostDetailDialogProps = {
  post: ILinkedInPost | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PostDetailDialog({
  post,
  open,
  onOpenChange,
}: PostDetailDialogProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [externalUrl, setExternalUrl] = useState('')
  const markMut = useMarkLinkedInPostedMutation()

  async function handleCopy() {
    if (!post) return
    const plain = htmlToLinkedInPlain(post.body || '')
    const tags = (post.hashtags ?? []).map((t) => `#${t.replace(/^#/, '')}`).join(' ')
    const text = [post.title, plain, tags].filter(Boolean).join('\n\n')
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied plain text for LinkedIn')
    } catch {
      toast.error('Clipboard not available')
    }
  }

  async function handleConfirmPosted() {
    if (!post) return
    const url = externalUrl.trim()
    try {
      await markMut.mutateAsync({
        id: post.id,
        externalUrl: url.length > 0 ? url : undefined,
      })
      toast.success('Marked as posted')
      setConfirmOpen(false)
      setExternalUrl('')
      onOpenChange(false)
    } catch {
      toast.error('Could not update post')
    }
  }

  if (!post) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>{post.title}</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-2'>
            <div className='text-muted-foreground flex flex-wrap gap-3 text-sm'>
              {post.scheduledAt ? (
                <span>
                  Scheduled:{' '}
                  {format(parseISO(post.scheduledAt), 'MMM d, yyyy HH:mm')}
                </span>
              ) : (
                <span>No schedule</span>
              )}
              {post.postedAt ? (
                <span>
                  Posted: {format(parseISO(post.postedAt), 'MMM d, yyyy HH:mm')}
                </span>
              ) : null}
            </div>
            {(post.hashtags?.length ?? 0) > 0 ? (
              <p className='text-sm'>
                {(post.hashtags ?? []).map((h, i) => (
                  <span key={`${h}-${i}`} className='text-primary me-2 font-medium'>
                    #{h.replace(/^#/, '')}
                  </span>
                ))}
              </p>
            ) : null}
            <div
              className='prose prose-sm dark:prose-invert max-w-none border-t pt-4'
              dangerouslySetInnerHTML={{ __html: post.body || '' }}
            />
            {!post.postedAt ? (
              <div className='flex flex-wrap gap-2 border-t pt-4'>
                <Button type='button' size='lg' onClick={() => void handleCopy()}>
                  Copy to LinkedIn
                </Button>
                <Button
                  type='button'
                  variant='secondary'
                  size='lg'
                  onClick={() => setConfirmOpen(true)}
                >
                  I posted this
                </Button>
              </div>
            ) : (
              <p className='text-muted-foreground text-sm'>
                This post is already marked as posted.
                {post.externalUrl ? (
                  <>
                    {' '}
                    <a
                      href={post.externalUrl}
                      className='text-primary underline'
                      target='_blank'
                      rel='noreferrer'
                    >
                      Open link
                    </a>
                  </>
                ) : null}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as posted?</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm you published this on LinkedIn after copying. Optionally
              paste the public URL of the post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='grid gap-2 py-2'>
            <Label htmlFor='li-external'>Post URL (optional)</Label>
            <Input
              id='li-external'
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder='https://www.linkedin.com/feed/update/...'
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel type='button'>Cancel</AlertDialogCancel>
            <Button
              type='button'
              disabled={markMut.isPending}
              onClick={() => void handleConfirmPosted()}
            >
              {markMut.isPending ? 'Saving…' : 'Confirm'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
