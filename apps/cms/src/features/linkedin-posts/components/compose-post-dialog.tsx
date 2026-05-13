import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { useCreateLinkedInPostMutation } from '../hooks/use-linkedin-posts-query'
import { toast } from 'sonner'

type ComposePostDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ComposePostDialog({ open, onOpenChange }: ComposePostDialogProps) {
  const [title, setTitle] = useState('')
  const [hashtagsRaw, setHashtagsRaw] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [body, setBody] = useState('')
  const createMut = useCreateLinkedInPostMutation()

  function reset() {
    setTitle('')
    setHashtagsRaw('')
    setScheduledAt('')
    setBody('')
  }

  async function handleSave() {
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }
    const hashtags = hashtagsRaw
      .split(/[,\s]+/)
      .map((s) => s.replace(/^#/, '').trim())
      .filter(Boolean)
    try {
      await createMut.mutateAsync({
        title: title.trim(),
        body,
        hashtags,
        scheduledAt: scheduledAt
          ? new Date(scheduledAt).toISOString()
          : undefined,
      })
      toast.success('Draft saved')
      reset()
      onOpenChange(false)
    } catch {
      toast.error('Could not save draft')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset()
        onOpenChange(v)
      }}
    >
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Compose LinkedIn post</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-2'>
          <div className='grid gap-2'>
            <Label htmlFor='li-title'>Title</Label>
            <Input
              id='li-title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Post headline'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='li-tags'>Hashtags (comma-separated)</Label>
            <Input
              id='li-tags'
              value={hashtagsRaw}
              onChange={(e) => setHashtagsRaw(e.target.value)}
              placeholder='buildinpublic, typescript'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='li-sched'>Schedule (optional, local)</Label>
            <Input
              id='li-sched'
              type='datetime-local'
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>
          <div className='grid gap-2'>
            <Label>Body</Label>
            <RichTextEditor value={body} onChange={setBody} />
          </div>
        </div>
        <DialogFooter>
          <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type='button'
            onClick={() => void handleSave()}
            disabled={createMut.isPending}
          >
            {createMut.isPending ? 'Saving…' : 'Save draft'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
