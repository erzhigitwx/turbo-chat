import { signInWithPopup, GoogleAuthProvider, getAuth } from 'firebase/auth'
import { handleRegistration } from '@/features/auth/handle-registration'

export const googleSignIn = async () => {
  const auth = getAuth()
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  const user = result.user
  if (result && result.user) {
    await handleRegistration({
      login: user.displayName as string,
      email: user.email as string,
      method: 'google',
      nickname: '',
    })
  } else {
    console.error('User authentication failed.')
  }
}
