import { useSearch } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { UserAuthForm } from './components/user-auth-form'
import { AuthLayout } from '../auth-layout'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardContent>
          <UserAuthForm redirectTo={redirect} />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
