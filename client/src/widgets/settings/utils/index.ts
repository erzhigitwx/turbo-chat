import { Dispatch, FormEvent, SetStateAction } from 'react'
import { object, ValidationError } from 'yup'
import { loginValidation, nameValidation } from '@/shared/constants'
import { Fetch } from '@/shared/utils/methods'
import { getCookie } from '@/shared/utils'
import { Status } from '@/shared/types'

export const handleSave = async (
  e: FormEvent<HTMLFormElement>,
  setStatus: Dispatch<SetStateAction<Status | null>>,
) => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  const login = formData.get('login') as string
  const lastname = formData.get('lastname') as string
  const name = formData.get('name') as string
  const surname = formData.get('surname') as string
  const avatar = formData.get('avatar') as File

  const userSchema = object({
    login: loginValidation,
    lastname: nameValidation('lastname'),
    name: nameValidation('name'),
    surname: nameValidation('surname'),
  })

  try {
    await userSchema.validate(
      { login, lastname, name, surname },
      {
        abortEarly: false,
      },
    )

    const uploadRes =
      !!avatar &&
      (await Fetch(import.meta.env.VITE_API_URL + '/api/users/set-avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getCookie('token')}`,
        },
        body: formData,
      }))

    const validateRes = await Fetch(import.meta.env.VITE_API_URL + '/api/users/manage-user', {
      method: 'POST',
      body: JSON.stringify({
        token: getCookie('token'),
        node: {
          login: login,
          ...(uploadRes.data && { avatar: uploadRes.data }),
          fullname: {
            lastname,
            name,
            surname,
          },
        },
      }),
    })

    if (validateRes.success) {
      setStatus((prev) => ({
        ...prev,
        login: { text: '', ok: true },
        lastname: { text: '', ok: true },
        surname: { text: '', ok: true },
        name: { text: '', ok: true },
      }))
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
