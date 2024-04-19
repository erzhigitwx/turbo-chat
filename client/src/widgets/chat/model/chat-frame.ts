import { createEvent, createStore } from 'effector'
import { Chat } from '@/shared/types'
import { $chats, fetchOpponentFx } from '@/widgets/chat/model/chat'

const selectedChatChanged = createEvent<string>()
const $selectedChat = createStore<Chat | null>(null).on(selectedChatChanged, (_, payload: string) =>
  $chats.getState().find((chat) => chat.id === payload),
)

$chats.watch(() => {
  const selectedChatId = $selectedChat.getState()?.id
  if (selectedChatId) {
    selectedChatChanged(selectedChatId)
  }
})
$selectedChat.watch(async (chat) => {
  if (chat) {
    await fetchOpponentFx(chat.opponentId)
  }
})

export { $selectedChat, selectedChatChanged }
