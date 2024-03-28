import { signInWithPopup, getAuth, GithubAuthProvider } from 'firebase/auth'
import { handleRegistration } from '@/features/auth/handle-registration'

export const githubSignIn = async () => {
  try {
    const auth = getAuth()
    const provider = new GithubAuthProvider()

    const result = await signInWithPopup(auth, provider)

    if (result && result.user) {
      const user = result.user
      await handleRegistration({
        login: user.displayName || '',
        email: user.email || '',
        method: 'github',
        nickname: '',
      })
    } else {
      console.error('User authentication failed.')
    }
  } catch (error) {
    console.error('Error signing in with GitHub:', error)
  }
}
