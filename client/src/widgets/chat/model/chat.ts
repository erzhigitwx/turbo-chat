import { createEffect, createStore } from 'effector'
import { Fetch } from '@/shared/utils/methods'
import { getCookie } from '@/shared/utils'
import { Chat, UserData } from '@/shared/types'

// effects
export const fetchChatsFx = createEffect(async function () {
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
      id: opponentId,
      token: getCookie('token'),
    }),
  })
})

// stores
const $chats = createStore<Chat[]>([]).on(fetchChatsFx.doneData, (_, chats) => chats.data)

const $createdChat = createStore<Chat | null>(null).on(
  fetchCreatedChatFx.doneData,
  (_, chat) => chat.data,
)
const $opponent = createStore<UserData | null>(null).on(
  fetchOpponentFx.doneData,
  (_, user) => user.data,
)

$createdChat.watch(async (chat) => {
  await fetchChatsFx()
  if (chat) {
    await fetchOpponentFx(chat.opponentId)
  }
})

await fetchChatsFx()

export { $chats, $createdChat, $opponent, fetchOpponentFx }
