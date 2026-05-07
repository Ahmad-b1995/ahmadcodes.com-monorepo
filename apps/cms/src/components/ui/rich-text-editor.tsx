import { useEffect, useRef } from 'react'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Code2,
  Minus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Separator } from './separator'

type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  className,
}: RichTextEditorProps) {
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { HTMLAttributes: { class: 'rich-text-codeblock' } },
      }),
      Typography,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-2',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-md max-w-full my-4' },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-slate dark:prose-invert max-w-none min-h-[20rem] focus:outline-none p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChangeRef.current(editor.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [editor, value])

  if (!editor) {
    return (
      <div className='border-input min-h-[24rem] animate-pulse rounded-md border bg-muted/30' />
    )
  }

  return (
    <div
      className={cn(
        'border-input bg-background flex flex-col rounded-md border',
        className
      )}
    >
      <Toolbar editor={editor} />
      <Separator />
      <EditorContent editor={editor} />
    </div>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL', previous ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const setImage = () => {
    const url = window.prompt('Image URL')
    if (!url) return
    editor.chain().focus().setImage({ src: url }).run()
  }

  return (
    <div className='flex flex-wrap items-center gap-0.5 p-1.5'>
      <ToolbarButton
        label='Bold'
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        label='Italic'
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        label='Strikethrough'
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        label='Inline code'
        active={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className='size-4' />
      </ToolbarButton>

      <Separator orientation='vertical' className='mx-1 h-5' />

      <ToolbarButton
        label='Heading 1'
        active={editor.isActive('heading', { level: 1 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        <Heading1 className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        label='Heading 2'
        active={editor.isActive('heading', { level: 2 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        label='Heading 3'
        active={editor.isActive('heading', { level: 3 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        <Heading3 className='size-4' />
      </ToolbarButton>

      <Separator orientation='vertical' className='mx-1 h-5' />

      <ToolbarButton
        label='Bulleted list'
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        label='Numbered list'
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        label='Quote'
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        label='Code block'
        active={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code2 className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        label='Horizontal rule'
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className='size-4' />
      </ToolbarButton>

      <Separator orientation='vertical' className='mx-1 h-5' />

      <ToolbarButton
        label='Link'
        active={editor.isActive('link')}
        onClick={setLink}
      >
        <LinkIcon className='size-4' />
      </ToolbarButton>
      <ToolbarButton label='Image' onClick={setImage}>
        <ImageIcon className='size-4' />
      </ToolbarButton>

      <Separator orientation='vertical' className='mx-1 h-5' />

      <ToolbarButton
        label='Undo'
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        label='Redo'
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className='size-4' />
      </ToolbarButton>
    </div>
  )
}

type ToolbarButtonProps = React.ComponentProps<typeof Button> & {
  label: string
  active?: boolean
}

function ToolbarButton({
  label,
  active,
  className,
  ...props
}: ToolbarButtonProps) {
  return (
    <Button
      type='button'
      variant='ghost'
      size='sm'
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'size-8 p-0',
        active && 'bg-accent text-accent-foreground',
        className
      )}
      {...props}
    />
  )
}
