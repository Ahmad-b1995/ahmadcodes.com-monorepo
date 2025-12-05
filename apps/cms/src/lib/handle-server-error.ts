import { AxiosError } from 'axios'
import { toast } from 'sonner'

export function handleServerError(error: unknown) {
  // eslint-disable-next-line no-console
  console.log(error)

  let errMsg = 'Something went wrong!'

  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  ) {
    errMsg = 'Content not found.'
  }

  if (error instanceof AxiosError) {
    // Try to get error message from response data
    errMsg =
      error.response?.data?.message ||
      error.response?.data?.title ||
      error.message ||
      'Something went wrong!'
  }

  toast.error(errMsg)
}
