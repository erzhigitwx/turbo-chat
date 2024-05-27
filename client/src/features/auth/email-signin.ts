import { Dispatch, FormEvent, SetStateAction } from 'react'
import { handleRegistration } from '@/features/auth/handle-registration'
import { object, ValidationError } from 'yup'
import { Fetch } from '@/shared/utils/methods'
import { Status } from '@/shared/types'
import { emailValidation, loginValidation, passwordValidation } from '@/shared/constants'

export const handleFormSubmit = async (
  e: FormEvent<HTMLFormElement>,
  setStatus: Dispatch<SetStateAction<Status | null>>,
) => {
  e.preventDefault()

  const formData = new FormData(e.currentTarget)
  const email = formData.get('email') as string
  const login = formData.get('login') as string
  const password = formData.get('password') as string

  try {
    await userSchema.validate({ email, login, password }, { abortEarly: false })

    const validateRes = await Fetch(import.meta.env.VITE_API_URL + '/api/reg/validate', {
      method: 'POST',
      body: JSON.stringify({ login, password, email }),
    })

    if (validateRes.success) {
      setStatus((prev) => ({
        ...prev,
        email: { text: '', ok: true },
        login: { text: '', ok: true },
        password: { text: '', ok: true },
      }))

      await handleRegistration({
        email,
        login,
        password,
        nickname: '',
        method: 'default',
      })
    } else {
      setStatus(() => {
        return Object.keys(validateRes.data).reduce((acc, key) => {
          acc[key] = validateRes.data[key]
          return acc
        }, {} as Status)
      })
    }
  } catch (error: any) {
    if (error instanceof ValidationError) {
      setStatus((prev) => {
        const newStatus = { ...prev }
        error.inner.forEach((err: any) => {
          newStatus[err.path] = { text: err.message, ok: false }
        })
        Object.keys(newStatus).forEach((key) => {
          if (!error.inner.some((err: any) => err.path === key)) {
            newStatus[key] = { text: '', ok: true }
          }
        })
        return newStatus
      })
    } else {
      throw new Error('unhandled error while validating')
    }
  }
}

let userSchema = object({
  email: emailValidation,
  login: loginValidation,
  password: passwordValidation,
})
