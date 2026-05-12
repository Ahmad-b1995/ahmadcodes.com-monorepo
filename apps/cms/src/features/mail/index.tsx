import { useEffect, useMemo, useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider } from '@/components/ui/tooltip'
import { mailFolders, type MailFolder } from './data/folders'
import { MailComposeDialog } from './components/mail-compose-dialog'
import { MailDetailPanel } from './components/mail-detail-panel'
import { MailList } from './components/mail-list'
import {
  useMailListQuery,
  useVerifySmtpMutation,
} from './hooks/use-mail-query'
import type { IMailMessage } from '@repo/shared/dtos'

type Props = {
  folder: MailFolder
}

export function Mail({ folder }: Props) {
  const config = mailFolders[folder]
  const list = useMailListQuery(config.filters)
  const verifyMutation = useVerifySmtpMutation()

  const [composeOpen, setComposeOpen] = useState(false)
  const [replyContext, setReplyContext] = useState<IMailMessage | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const messages = useMemo(() => list.data?.items ?? [], [list.data?.items])

  // Auto-select first message when folder changes and there's data.
  useEffect(() => {
    setSelectedId(null)
  }, [folder])

  useEffect(() => {
    if (selectedId === null && messages.length > 0) {
      setSelectedId(messages[0].id)
    }
  }, [messages, selectedId])

  const Icon = config.icon
  const supported = config.filters !== null

  return (
    <TooltipProvider delayDuration={200}>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div className='mb-2 flex flex-wrap items-center justify-between gap-2'>
          <div>
            <h2 className='flex items-center gap-2 text-2xl font-bold tracking-tight'>
              <Icon className='size-6' /> {config.title}
            </h2>
            <p className='text-muted-foreground text-sm'>
              {supported
                ? folder === 'inbox'
                  ? 'Inbound mail. Waiting on Cloudflare Email Worker → /mail/inbound webhook.'
                  : 'Sent mail through the configured SMTP relay.'
                : config.emptyDescription}
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
            {config.showCompose && (
              <Button onClick={() => setComposeOpen(true)}>
                <Plus className='size-4' />
                Compose
              </Button>
            )}
          </div>
        </div>

        <Separator />

        <ResizablePanelGroup
          direction='horizontal'
          autoSaveId={`mail-${folder}`}
          className='h-[calc(100vh-13rem)] min-h-[400px] items-stretch'
        >
          <ResizablePanel defaultSize={35} minSize={25} maxSize={55}>
            {!supported ? (
              <EmptyFolder
                title={config.emptyTitle}
                description={config.emptyDescription}
              />
            ) : list.isLoading ? (
              <CenterMessage>Loading…</CenterMessage>
            ) : list.error ? (
              <CenterMessage tone='error'>
                Failed to load. Try again later.
              </CenterMessage>
            ) : messages.length === 0 ? (
              <EmptyFolder
                title={config.emptyTitle}
                description={config.emptyDescription}
              />
            ) : (
              <MailList
                folder={config}
                messages={messages}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={65} minSize={30}>
            <MailDetailPanel
              selectedId={selectedId}
              onReply={(message) => {
                setReplyContext(message)
                setComposeOpen(true)
              }}
              onCleared={() => setSelectedId(null)}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </Main>

      <MailComposeDialog
        open={composeOpen}
        onOpenChange={(open) => {
          setComposeOpen(open)
          if (!open) setReplyContext(null)
        }}
        initialTo={replyContext?.fromAddress}
        initialSubject={
          replyContext ? `Re: ${replyContext.subject.replace(/^Re:\s*/i, '')}` : undefined
        }
      />
    </TooltipProvider>
  )
}

function CenterMessage({
  children,
  tone = 'muted',
}: {
  children: React.ReactNode
  tone?: 'muted' | 'error'
}) {
  return (
    <div
      className={`flex h-full items-center justify-center p-8 text-center text-sm ${
        tone === 'error' ? 'text-destructive' : 'text-muted-foreground'
      }`}
    >
      {children}
    </div>
  )
}

function EmptyFolder({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-2 p-8 text-center'>
      <div className='text-sm font-medium'>{title}</div>
      <p className='text-muted-foreground max-w-xs text-xs'>{description}</p>
    </div>
  )
}
