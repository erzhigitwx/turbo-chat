import { Dispatch, FormEvent, SetStateAction } from 'react'
import { handleRegistration } from '@/features/auth/handle-registration'
import { object, string, ValidationError } from 'yup'
import { Status } from '@/widgets/registration-form/registration-form.props'
import { Fetch } from '@/shared/utils/methods'

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

    const validateRes = await Fetch('http://localhost:5000/api/reg/validate', {
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
  email: string().required('Email is required').email('Must be the correct email'),
  login: string().trim().min(3).max(16).required('Login is required'),
  password: string()
    .trim()
    .transform((value) => (value === '' ? undefined : value))
    .required('Password is required')
    .matches(/^(?=.*[0-9])/, 'Password must contain at least one digit')
    .matches(/^(?=.*[a-zA-Z])/, 'Password must contain at least one letter')
    .min(6, 'Password must be at least 6 characters long')
    .max(16, 'Password must be less than 16 characters long'),
})
