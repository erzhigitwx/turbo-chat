import { createEffect, createEvent, createStore } from 'effector'
import { Chat, UserData } from '@/shared/types'
import { Fetch } from '@/shared/utils/methods'
import { getCookie } from '@/shared/utils'

const fetchUsersFx = createEffect(async function () {
  const searchValue = $seachValue.getState()

  return await Fetch(import.meta.env.VITE_API_URL + '/api/chats/search-users', {
    method: 'POST',
    body: JSON.stringify({ query: searchValue, token: getCookie('token') }),
  })
})

const searchValueChanged = createEvent<string>()

const $searchedChats = createStore<{
  searchResults: UserData[]
  existingChats: Chat[]
} | null>(null).on(fetchUsersFx.doneData, (_, users) => users.data)
const $isFetchingUsers = createStore(false)
  .on(fetchUsersFx, () => true)
  .on(fetchUsersFx.done, () => false)
  .on(fetchUsersFx.fail, () => false)

const $seachValue = createStore<string>('')

$seachValue.on(searchValueChanged, (_, payload) => payload)

$seachValue.watch(async () => {
  await fetchUsersFx()
})

export { fetchUsersFx, $searchedChats, $isFetchingUsers, $seachValue, searchValueChanged }
