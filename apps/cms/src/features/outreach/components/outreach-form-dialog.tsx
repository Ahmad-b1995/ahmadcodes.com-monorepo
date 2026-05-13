import { useEffect, useState } from 'react'
import type {
  ICreateOutreachContactDto,
  IOutreachContact,
  IUpdateOutreachContactDto,
} from '@repo/shared/dtos'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  useCreateOutreachMutation,
  useUpdateOutreachMutation,
} from '../hooks/use-outreach-query'
import { toast } from 'sonner'

const SOURCES: IOutreachContact['source'][] = [
  'warm',
  'cold',
  'linkedin',
  'event',
  'referral',
]

type OutreachFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: IOutreachContact | null
}

export function OutreachFormDialog({
  open,
  onOpenChange,
  contact,
}: OutreachFormDialogProps) {
  const isEdit = contact !== null
  const createMut = useCreateOutreachMutation()
  const updateMut = useUpdateOutreachMutation()

  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [source, setSource] = useState<ICreateOutreachContactDto['source']>('linkedin')
  const [status, setStatus] = useState<IOutreachContact['status']>('queued')
  const [notes, setNotes] = useState('')
  const [tagsRaw, setTagsRaw] = useState('')

  useEffect(() => {
    if (!open) return
    if (contact) {
      setName(contact.name)
      setCompany(contact.company)
      setRole(contact.role)
      setEmail(contact.email)
      setLinkedinUrl(contact.linkedinUrl ?? '')
      setSource(contact.source)
      setStatus(contact.status)
      setNotes(contact.notes)
      setTagsRaw((contact.tags ?? []).join(', '))
    } else {
      setName('')
      setCompany('')
      setRole('')
      setEmail('')
      setLinkedinUrl('')
      setSource('linkedin')
      setStatus('queued')
      setNotes('')
      setTagsRaw('')
    }
  }, [open, contact])

  async function handleSave() {
    if (!name.trim()) {
      toast.error('Name is required')
      return
    }
    const tags = tagsRaw
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    try {
      if (isEdit && contact) {
        const data: IUpdateOutreachContactDto = {
          name: name.trim(),
          company,
          role,
          email: email.trim() || undefined,
          linkedinUrl: linkedinUrl.trim() || undefined,
          source,
          status,
          notes,
          tags,
        }
        await updateMut.mutateAsync({ id: contact.id, data })
        toast.success('Contact updated')
      } else {
        const data: ICreateOutreachContactDto = {
          name: name.trim(),
          company,
          role,
          email: email.trim() || undefined,
          linkedinUrl: linkedinUrl.trim() || undefined,
          source,
          status,
          notes,
          tags,
        }
        await createMut.mutateAsync(data)
        toast.success('Contact created')
      }
      onOpenChange(false)
    } catch {
      toast.error('Could not save contact')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit contact' : 'New contact'}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-3 py-2'>
          <div className='grid gap-2'>
            <Label htmlFor='o-name'>Name</Label>
            <Input
              id='o-name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='o-company'>Company</Label>
            <Input
              id='o-company'
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='o-role'>Role</Label>
            <Input id='o-role' value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='o-email'>Email</Label>
            <Input
              id='o-email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='o-li'>LinkedIn URL</Label>
            <Input
              id='o-li'
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
          </div>
          <div className='grid gap-2'>
            <Label>Source</Label>
            <Select
              value={source}
              onValueChange={(v) => setSource(v as ICreateOutreachContactDto['source'])}
            >
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='grid gap-2'>
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as IOutreachContact['status'])}
            >
              <SelectTrigger className='w-full'>
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
            <Label htmlFor='o-notes'>Notes</Label>
            <Textarea
              id='o-notes'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='o-tags'>Tags (comma-separated)</Label>
            <Input
              id='o-tags'
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type='button'
            onClick={() => void handleSave()}
            disabled={createMut.isPending || updateMut.isPending}
          >
            {createMut.isPending || updateMut.isPending ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
