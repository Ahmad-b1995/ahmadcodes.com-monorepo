import {
  Archive,
  FileEdit,
  Inbox,
  Send,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import type { IMailListFilters, MailDirection } from '@repo/shared/dtos'

export type MailFolder = 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash'

export type MailFolderConfig = {
  slug: MailFolder
  title: string
  icon: LucideIcon
  /** Filters to send to the API. `null` means "not yet supported — show empty state". */
  filters: IMailListFilters | null
  /** What to show on the "counterparty" column in the list. */
  counterpartyColumn: 'from' | 'to'
  /** Copy shown when the folder is empty. */
  emptyTitle: string
  emptyDescription: string
  /** Allow opening the compose dialog from this folder. */
  showCompose: boolean
}

const RECEIVED: MailDirection = 'received'
const SENT: MailDirection = 'sent'

export const mailFolders: Record<MailFolder, MailFolderConfig> = {
  inbox: {
    slug: 'inbox',
    title: 'Inbox',
    icon: Inbox,
    filters: { direction: RECEIVED },
    counterpartyColumn: 'from',
    emptyTitle: 'No inbound mail',
    emptyDescription:
      'Inbound webhook is not yet wired. See REMINDERS.md → "Inbound mail — architecture for v2".',
    showCompose: true,
  },
  sent: {
    slug: 'sent',
    title: 'Sent',
    icon: Send,
    filters: { direction: SENT },
    counterpartyColumn: 'to',
    emptyTitle: 'No sent mail yet',
    emptyDescription: 'Click Compose to send your first email.',
    showCompose: true,
  },
  drafts: {
    slug: 'drafts',
    title: 'Drafts',
    icon: FileEdit,
    filters: null,
    counterpartyColumn: 'to',
    emptyTitle: 'Drafts coming soon',
    emptyDescription:
      'Compose currently sends directly. Save-as-draft will be added in a future iteration.',
    showCompose: true,
  },
  archive: {
    slug: 'archive',
    title: 'Archive',
    icon: Archive,
    filters: null,
    counterpartyColumn: 'from',
    emptyTitle: 'Archive coming soon',
    emptyDescription: 'No messages are archived yet.',
    showCompose: false,
  },
  trash: {
    slug: 'trash',
    title: 'Trash',
    icon: Trash2,
    filters: null,
    counterpartyColumn: 'from',
    emptyTitle: 'Trash coming soon',
    emptyDescription:
      'Delete currently removes messages permanently. Soft-delete will be added later.',
    showCompose: false,
  },
}
