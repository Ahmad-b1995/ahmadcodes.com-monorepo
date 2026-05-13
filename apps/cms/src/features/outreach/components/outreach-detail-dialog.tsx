import { useEffect, useState } from 'react'
import type { IOutreachContact } from '@repo/shared/dtos'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateOutreachMutation } from '../hooks/use-outreach-query'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'

type OutreachDetailDialogProps = {
  contact: IOutreachContact | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (c: IOutreachContact) => void
}

export function OutreachDetailDialog({
  contact,
  open,
  onOpenChange,
  onEdit,
}: OutreachDetailDialogProps) {
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<IOutreachContact['status']>('queued')
  const updateMut = useUpdateOutreachMutation()

  useEffect(() => {
    if (contact) {
      setNotes(contact.notes)
      setStatus(contact.status)
    }
  }, [contact])

  async function handleSave() {
    if (!contact) return
    try {
      await updateMut.mutateAsync({
        id: contact.id,
        data: { notes, status },
      })
      toast.success('Saved')
      onOpenChange(false)
    } catch {
      toast.error('Could not save')
    }
  }

  if (!contact) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{contact.name}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-2 text-sm'>
          <div className='text-muted-foreground grid gap-1'>
            {contact.company ? <span>{contact.company}</span> : null}
            {contact.role ? <span>{contact.role}</span> : null}
            {contact.email ? <span>{contact.email}</span> : null}
            <span>Source: {contact.source}</span>
            <span>
              Last contacted:{' '}
              {contact.lastContactedAt
                ? format(parseISO(contact.lastContactedAt), 'MMM d, yyyy HH:mm')
                : '—'}
            </span>
            <span>
              Last reply:{' '}
              {contact.lastReplyAt
                ? format(parseISO(contact.lastReplyAt), 'MMM d, yyyy HH:mm')
                : '—'}
            </span>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='d-status'>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as IOutreachContact['status'])}
            >
              <SelectTrigger id='d-status' className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  [
                    'queued',
                    'contacted',
                    'responded',
                    'booked',
                    'closed',
                  ] as const
                ).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='d-notes'>Notes</Label>
            <Textarea
              id='d-notes'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
            />
          </div>
        </div>
        <DialogFooter className='flex flex-wrap gap-2'>
          <Button type='button' variant='outline' onClick={() => onEdit(contact)}>
            Edit all fields
          </Button>
          <Button
            type='button'
            onClick={() => void handleSave()}
            disabled={updateMut.isPending}
          >
            {updateMut.isPending ? 'Saving…' : 'Save notes & status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
