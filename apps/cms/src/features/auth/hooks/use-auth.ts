import { useAuthStore } from '@/stores/auth-store'

export function useAuth() {
  const { user, isAuthenticated, reset } = useAuthStore()

  return {
    user,
    isAuthenticated: isAuthenticated(),
    logout: reset,
  }
}

