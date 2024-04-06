import { createEffect, createEvent, createStore } from 'effector'
import { Fetch } from '@/shared/utils/methods'
import { getCookie } from '@/shared/utils'
import { Chat, UserData } from '@/shared/types'

// effects
const fetchUsersFx = createEffect(async function () {
  const searchValue = $seachValue.getState()

  return await Fetch('http://localhost:5000/api/chats/search-users', {
    method: 'POST',
    body: JSON.stringify({ query: searchValue, token: getCookie('token') }),
  })
})
const fetchChatsFx = createEffect(async function () {
  return await Fetch('http://localhost:5000/api/chats/get-chats', {
    method: 'POST',
    body: JSON.stringify({ token: getCookie('token') }),
  })
})
export const fetchCreatedChatFx = createEffect(async function (opponentId: string) {
  const res = await Fetch('http://localhost:5000/api/chats/create-chat', {
    method: 'POST',
    body: JSON.stringify({
      opponentId: opponentId,
      token: getCookie('token'),
    }),
  })
  return res
})
const fetchOpponentFx = createEffect(async function (opponentId: string) {
  return await Fetch('http://localhost:5000/api/users/get-user', {
    method: 'POST',
    body: JSON.stringify({
      opponentId,
      token: getCookie('token'),
    }),
  })
})

// events
const searchValueChanged = createEvent<string>()
const selectedChatChanged = createEvent<string>()

// stores
const $searchedChats = createStore<{
  searchResults: UserData[]
  existingChats: Chat[]
} | null>(null).on(fetchUsersFx.doneData, (_, users) => users.data)
const $chats = createStore<Chat[]>([]).on(fetchChatsFx.doneData, (_, chats) => chats.data)
const $selectedChat = createStore<Chat | null>(null).on(
  selectedChatChanged,
  (_, payload: string) => $chats.getState().filter((chat) => chat.opponentId === payload)[0],
)
const $createdChat = createStore<Chat | null>(null).on(
  fetchCreatedChatFx.doneData,
  (_, chat) => chat.data,
)
const $opponent = createStore<UserData | null>(null).on(
  fetchOpponentFx.doneData,
  (_, user) => user.data,
)
const $seachValue = createStore<string>('')

$seachValue.on(searchValueChanged, (_, payload) => payload)

$seachValue.watch(() => {
  fetchUsersFx()
})
$createdChat.watch((chat) => {
  fetchChatsFx()
  if (chat) {
    fetchOpponentFx(chat.opponentId)
  }
})
$selectedChat.watch((chat) => {
  if (chat) {
    fetchOpponentFx(chat.opponentId)
  }
})
fetchChatsFx()

export {
  searchValueChanged,
  selectedChatChanged,
  $seachValue,
  $searchedChats,
  $chats,
  $selectedChat,
  $createdChat,
  $opponent,
}
