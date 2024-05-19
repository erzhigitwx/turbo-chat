import cl from '../chat-frame-popup.module.scss'
import CrossImg from '@/assets/icons/cross.svg?react'
import { Popup } from '@/shared/UI/popup/popup'
import { Button } from '@/shared/UI'
import { $selectedChat, popupChanged } from '@/widgets/chat/model/chat-frame'
import { useContext, useState } from 'react'
import { SocketContext } from '@/app/providers/socket-provider'
import { getCookie } from '@/shared/utils'
import { useUnit } from 'effector-react'
import { $opponent } from '@/widgets/chat/model/chat'

const ChatClearPopup = () => {
  const [forBoth, setForBoth] = useState(false)
  const opponent = useUnit($opponent)
  const selectedChat = useUnit($selectedChat)
  const socket = useContext(SocketContext)

  function clearChat() {
    socket?.emit('clear-chat', {
      forBoth,
      chatId: selectedChat?.id,
      token: getCookie('token'),
    })

    popupChanged(null)
  }

  return (
    <Popup extraClass={cl.chatPopup} onClick={() => popupChanged(null)} isCentered withShadow>
      <div className={cl.chatPopupHeader} onClick={(e) => e.stopPropagation()}>
        <h2>Очистить чат</h2>
        <Button onClick={() => popupChanged(null)}>
          <CrossImg />
        </Button>
      </div>
      <div className={cl.chatPopupNotice}>
        <p>Очистить чат с {opponent?.login}?</p>
        <p>Это действие нельзя будет отменить.</p>
      </div>
      <label className={cl.chatPopupControl}>
        <input type="checkbox" checked={forBoth} onChange={(e) => setForBoth(e.target.checked)} />
        <p>Очистить у меня и у {opponent?.login}</p>
      </label>
      <div className={cl.chatPopupButtons}>
        <Button onClick={() => popupChanged(null)}>
          <p>Отмена</p>
        </Button>
        <Button onClick={clearChat}>
          <p>Очистить</p>
        </Button>
      </div>
    </Popup>
  )
}

export { ChatClearPopup }
