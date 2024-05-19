import { createEffect, createStore } from 'effector'
import { Fetch } from '@/shared/utils/methods'
import { getCookie } from '@/shared/utils'
import { UserData } from '@/shared/types'

export const fetchUserFx = createEffect(async () => {
  return await Fetch(import.meta.env.VITE_API_URL + '/api/users/get-user', {
    method: 'POST',
    body: JSON.stringify({
      token: getCookie('token'),
    }),
  })
})

const $user = createStore<UserData | null>(null).on(fetchUserFx.doneData, (_, user) => user.data)

fetchUserFx()

export { $user }
