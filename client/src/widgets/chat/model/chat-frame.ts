import { createEffect, createEvent, createStore } from 'effector'
import { Fetch } from '@/shared/utils/methods'
import { getCookie } from '@/shared/utils'
import { Chat } from '@/shared/types'
import { $chats, fetchOpponentFx } from '@/widgets/chat/model/chat'

export const fetchMessageFx = createEffect(async function (content: string) {
  const res = await Fetch('http://localhost:5000/api/chats/create-message', {
    method: 'POST',
    body: JSON.stringify({
      id: $selectedChat.getState()?.id,
      token: getCookie('token'),
      content,
    }),
  })
  return res
})

const selectedChatChanged = createEvent<string>()
const $selectedChat = createStore<Chat | null>(null).on(
  selectedChatChanged,
  (_, payload: string) => $chats.getState().filter((chat) => chat.id === payload)[0],
)

$selectedChat.watch(async (chat) => {
  if (chat) {
    await fetchOpponentFx(chat.opponentId)
  }
})

export { $selectedChat, selectedChatChanged }
