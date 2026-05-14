import {
  LayoutDashboard,
  Monitor,
  Bell,
  Palette,
  Settings,
  Wrench,
  UserCog,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  FileText,
  Mail,
  Inbox,
  Send,
  FileEdit,
  Archive,
  Trash2,
  Linkedin,
  Users,
  Sun,
  Target,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnffffaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Ahmadcodes CMS',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Today',
          url: '/today',
          icon: Sun,
        },
        {
          title: 'Goals',
          url: '/goals',
          icon: Target,
        },
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Articles',
          url: '/articles',
          icon: FileText,
        },
        {
          title: 'Mail',
          icon: Mail,
          items: [
            {
              title: 'Inbox',
              url: '/mail',
              icon: Inbox,
            },
            {
              title: 'Sent',
              url: '/mail/sent',
              icon: Send,
            },
            {
              title: 'Drafts',
              url: '/mail/drafts',
              icon: FileEdit,
            },
            {
              title: 'Archive',
              url: '/mail/archive',
              icon: Archive,
            },
            {
              title: 'Trash',
              url: '/mail/trash',
              icon: Trash2,
            },
          ],
        },
        {
          title: 'LinkedIn',
          url: '/linkedin-posts',
          icon: Linkedin,
        },
        {
          title: 'Outreach',
          url: '/outreach',
          icon: Users,
        },
      ],
    },

    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
      ],
    },
  ],
}
