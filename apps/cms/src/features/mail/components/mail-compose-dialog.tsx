import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { useSendMailMutation } from '../hooks/use-mail-query'

const emailListSchema = z
  .string()
  .optional()
  .transform((value) =>
    (value ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  )
  .pipe(
    z
      .array(
        z
          .string()
          .email({ message: 'Each address must be a valid email' }),
      ),
  )

const composeSchema = z.object({
  to: z
    .string()
    .min(1, 'At least one recipient is required')
    .transform((value) =>
      value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    )
    .pipe(
      z
        .array(z.string().email({ message: 'Each address must be a valid email' }))
        .min(1, 'At least one recipient is required'),
    ),
  cc: emailListSchema,
  bcc: emailListSchema,
  subject: z.string().min(1, 'Subject is required').max(200),
  bodyHtml: z.string().min(1, 'Body cannot be empty'),
})

/** Form field shapes before Zod transforms (matches resolver input). */
type ComposeFormInput = z.input<typeof composeSchema>
/** Values after Zod transforms — this is what `handleSubmit` receives. */
type ComposeFormOutput = z.output<typeof composeSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialTo?: string
  initialSubject?: string
  initialBody?: string
}

export function MailComposeDialog({
  open,
  onOpenChange,
  initialTo,
  initialSubject,
  initialBody,
}: Props) {
  const form = useForm<ComposeFormInput>({
    resolver: zodResolver(composeSchema),
    defaultValues: {
      to: initialTo ?? '',
      cc: '',
      bcc: '',
      subject: initialSubject ?? '',
      bodyHtml: initialBody ?? '',
    },
  })

  const sendMutation = useSendMailMutation()

  const onSubmit = form.handleSubmit(async (data: ComposeFormOutput) => {
    try {
      await sendMutation.mutateAsync({
        to: data.to,
        cc: data.cc.length ? data.cc : undefined,
        bcc: data.bcc.length ? data.bcc : undefined,
        subject: data.subject,
        bodyHtml: data.bodyHtml,
      })
      form.reset()
      onOpenChange(false)
    } catch {
      // Error toast is handled in useSendMailMutation onError
    }
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='flex max-h-[92vh] flex-col gap-0 p-0 sm:max-w-5xl'>
        <DialogHeader className='border-b px-6 py-4 text-start'>
          <DialogTitle>Compose</DialogTitle>
          <DialogDescription>
            Sends from the configured SMTP From address. Saved to the Mail
            log on success.
          </DialogDescription>
        </DialogHeader>
        <div className='min-h-0 flex-1 overflow-y-auto px-6 py-4'>
          <Form {...form}>
            <form
              id='mail-compose-form'
              onSubmit={onSubmit}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='to'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='name@example.com, other@example.com'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated email addresses.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='cc'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CC</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='cc@example.com'
                          autoComplete='off'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='bcc'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BCC</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='bcc@example.com'
                          autoComplete='off'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='subject'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='What is this about?'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='bodyHtml'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder='Write the email here. Toolbar supports headings, lists, code, links, images.'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter className='border-t px-6 py-4'>
          <Button
            type='submit'
            form='mail-compose-form'
            disabled={sendMutation.isPending}
          >
            {sendMutation.isPending ? 'Sending...' : 'Send'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
