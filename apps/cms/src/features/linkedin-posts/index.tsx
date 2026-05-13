import { useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import type { ILinkedInPost } from '@repo/shared/dtos'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ComposePostDialog } from './components/compose-post-dialog'
import { PostDetailDialog } from './components/post-detail-dialog'
import { tabForPost, useLinkedInPostsQuery } from './hooks/use-linkedin-posts-query'

function formatDt(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    return format(parseISO(iso), 'MMM d, yyyy HH:mm')
  } catch {
    return '—'
  }
}

export function LinkedInPosts() {
  const { data, isLoading, error } = useLinkedInPostsQuery()
  const [tab, setTab] = useState<'drafts' | 'scheduled' | 'posted'>('drafts')
  const [composeOpen, setComposeOpen] = useState(false)
  const [selected, setSelected] = useState<ILinkedInPost | null>(null)

  const byTab = useMemo(() => {
    const posts = data ?? []
    return {
      drafts: posts.filter((p) => tabForPost(p) === 'drafts'),
      scheduled: posts.filter((p) => tabForPost(p) === 'scheduled'),
      posted: posts.filter((p) => tabForPost(p) === 'posted'),
    }
  }, [data])

  const visible = byTab[tab]

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>LinkedIn</h1>
            <p className='text-muted-foreground'>
              Drafts, schedule, then copy plain text into LinkedIn when you post.
            </p>
          </div>
          <Button type='button' onClick={() => setComposeOpen(true)}>
            <Plus className='me-2 size-4' aria-hidden />
            Compose
          </Button>
        </div>

        {isLoading ? (
          <p className='text-muted-foreground'>Loading…</p>
        ) : error ? (
          <p className='text-destructive'>Could not load posts.</p>
        ) : (
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList className='mb-4'>
              <TabsTrigger value='drafts'>
                Drafts ({byTab.drafts.length})
              </TabsTrigger>
              <TabsTrigger value='scheduled'>
                Scheduled ({byTab.scheduled.length})
              </TabsTrigger>
              <TabsTrigger value='posted'>
                Posted ({byTab.posted.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value={tab}>
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Posted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visible.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className='text-muted-foreground h-24 text-center'>
                          No posts in this tab.
                        </TableCell>
                      </TableRow>
                    ) : (
                      visible.map((post) => (
                        <TableRow
                          key={post.id}
                          className='cursor-pointer'
                          onClick={() => setSelected(post)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setSelected(post)
                            }
                          }}
                          tabIndex={0}
                          role='button'
                          aria-label={`Open ${post.title}`}
                        >
                          <TableCell className='font-medium'>{post.title}</TableCell>
                          <TableCell>{formatDt(post.scheduledAt)}</TableCell>
                          <TableCell>{formatDt(post.postedAt)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        )}

        <ComposePostDialog open={composeOpen} onOpenChange={setComposeOpen} />
        <PostDetailDialog
          post={selected}
          open={selected !== null}
          onOpenChange={(o) => {
            if (!o) setSelected(null)
          }}
        />
      </Main>
    </>
  )
}
