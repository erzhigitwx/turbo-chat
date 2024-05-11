import { Fetch } from '@/shared/utils/methods'
import { setCookie } from '@/shared/utils'
import { Dispatch, FormEvent, SetStateAction } from 'react'
import { LoginStatus } from '@/widgets/registration-form/registration-form.props'

export const handleLogin = async (
  e: FormEvent<HTMLFormElement>,
  setLoginStatus: Dispatch<SetStateAction<LoginStatus>>,
) => {
  e.preventDefault()
  setLoginStatus((prev) => ({
    ...prev,
    isLoading: true,
  }))

  const formData = new FormData(e.currentTarget)
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const res = await Fetch('http://localhost:5000/api/reg/login', {
    method: 'POST',
    body: JSON.stringify({ password, email }),
  })

  if (res.success) {
    setCookie('token', res.data, 2)
    window.location.href = '/'
    setLoginStatus((prev) => ({
      ...prev,
      error: undefined,
      isLoading: false,
    }))
  } else {
    setLoginStatus((prev) => ({
      ...prev,
      error: res.message,
      isLoading: false,
    }))
  }
}
