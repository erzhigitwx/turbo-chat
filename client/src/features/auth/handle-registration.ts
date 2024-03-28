import { UserData } from '@/shared/types'
import { Fetch } from '@/shared/utils/methods'
import { setCookie } from '@/shared/utils'

export const handleRegistration = async (
  data: Omit<UserData, 'uid' | 'createdAt' | 'lastLoginAt'>,
) => {
  const res = await Fetch('http://localhost:5000/api/reg/registrate', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (res.success) {
    setCookie('token', res.data, 2)
    window.location.href = '/'
  }
}
