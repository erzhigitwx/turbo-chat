import { createEffect, createEvent, createStore } from 'effector'
import { Fetch } from '@/shared/utils/methods'
import { getCookie } from '@/shared/utils'
import { ChangeEvent } from 'react'
import { Chat } from '@/shared/types'

const fetchUsersFx = createEffect(async function () {
  const searchValue = $seachValue.getState()

  return await Fetch('http://localhost:5000/api/chats/search-chat', {
    method: 'POST',
    body: JSON.stringify({ query: searchValue, token: getCookie('token') }),
  })
})

const searchValueChanged = createEvent<ChangeEvent<HTMLInputElement>>()

const $searchedChats = createStore<Chat[]>([]).on(fetchUsersFx.doneData, (_, users) => users.data)
const $seachValue = createStore<string>('')

$seachValue.on(searchValueChanged, (_, payload) => payload.target.value)

$seachValue.watch(() => {
  fetchUsersFx()
})

export { searchValueChanged, $seachValue, $searchedChats }
