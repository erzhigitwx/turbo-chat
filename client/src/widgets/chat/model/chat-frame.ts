import { createEvent, createStore } from 'effector'
import { AttachType, Chat, ChatPopupType } from '@/shared/types'
import { $chats, fetchOpponentFx } from '@/widgets/chat/model/chat'
import { $user } from '@/app/model'

const selectedChatChanged = createEvent<string | null>()
const popupChanged = createEvent<ChatPopupType | null>()
const attachChanged = createEvent<AttachType | null>()
const $selectedChat = createStore<Chat | null>(null).on(
  selectedChatChanged,
  (_, payload: string | null) => {
    if (payload) return $chats.getState().find((chat) => chat.id === payload)
    return null
  },
)
const $popup = createStore<ChatPopupType | null>(null).on(popupChanged, (_, payload) => payload)
const $attach = createStore<AttachType | null>(null).on(attachChanged, (_, payload) => payload)

$chats.watch(() => {
  const selectedChatId = $selectedChat.getState()?.id
  if (selectedChatId) {
    selectedChatChanged(selectedChatId)
  }
})
$selectedChat.watch(async (chat) => {
  if (chat) {
    await fetchOpponentFx(
      chat.opponentId === $user.getState()?.uid ? chat.creatorId : chat.opponentId,
    )
  }
})

export { $selectedChat, $popup, popupChanged, selectedChatChanged, $attach, attachChanged }
