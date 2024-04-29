import { createEvent, createStore } from 'effector'
import { Chat, ChatPopupType } from '@/shared/types'
import { $chats, fetchOpponentFx } from '@/widgets/chat/model/chat'

const selectedChatChanged = createEvent<string>()
const popupChanged = createEvent<ChatPopupType | null>()
const $selectedChat = createStore<Chat | null>(null).on(selectedChatChanged, (_, payload: string) =>
  $chats.getState().find((chat) => chat.id === payload),
)
const $popup = createStore<ChatPopupType | null>(null).on(popupChanged, (_, payload) => payload)

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

export { $selectedChat, $popup, popupChanged, selectedChatChanged }
