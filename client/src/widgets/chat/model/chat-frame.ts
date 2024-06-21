import { createEvent, createStore } from 'effector'
import { AttachType, Chat, ChatPopupType } from '@/shared/types'
import { $chats, fetchOpponentFx } from '@/widgets/chat/model/chat'
import { $user } from '@/app/model'

const selectedChatChanged = createEvent<string | null>()
const popupChanged = createEvent<ChatPopupType | null>()
const attachTypeChanged = createEvent<AttachType['type'] | null>()
const attachDataChanged = createEvent<AttachType['data']>()
const $selectedChat = createStore<Chat | null>(null).on(
  selectedChatChanged,
  (_, payload: string | null) => {
    if (payload) return $chats.getState().find((chat) => chat.id === payload) || null
    return null
  },
)
const $popup = createStore<ChatPopupType | null>(null).on(popupChanged, (_, payload) => payload)
const $attach = createStore<AttachType | null>(null)
  .on(attachTypeChanged, (state, payload) => ({
    type: payload!,
    data: payload === state?.type ? state.data : [],
  }))
  .on(attachDataChanged, (state, payload) => ({
    type: state?.type || 'media',
    data: payload,
  }))

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
    attachDataChanged([])
    attachTypeChanged(null)
  }
})

export {
  $selectedChat,
  $popup,
  popupChanged,
  selectedChatChanged,
  $attach,
  attachTypeChanged,
  attachDataChanged,
}
