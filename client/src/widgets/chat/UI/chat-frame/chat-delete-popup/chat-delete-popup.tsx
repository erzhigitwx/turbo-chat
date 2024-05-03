import cl from '../chat-frame-popup.module.scss'
import CrossImg from '@/assets/icons/cross.svg?react'
import { Popup } from '@/shared/UI/popup/popup'
import { Button } from '@/shared/UI'
import { $selectedChat, popupChanged } from '@/widgets/chat/model/chat-frame'
import { getCookie } from '@/shared/utils'
import { useContext, useState } from 'react'
import { SocketContext } from '@/app/providers/socket-provider'
import { useUnit } from 'effector-react'

const ChatDeletePopup = () => {
  const [forBoth, setForBoth] = useState(false)
  const socket = useContext(SocketContext)
  const selectedChat = useUnit($selectedChat)

  function deleteChat() {
    socket?.emit('delete-chat', {
      forBoth,
      chatId: selectedChat?.id,
      token: getCookie('token'),
    })

    popupChanged(null)
  }

  return (
    <Popup extraClass={cl.chatPopup} onClick={() => popupChanged(null)} isCentered withShadow>
      <div className={cl.chatPopupHeader}>
        <h2>Удалить чат</h2>
        <Button onClick={() => popupChanged(null)}>
          <CrossImg />
        </Button>
      </div>
      <div className={cl.chatPopupNotice}>
        <p>Вы точно хотите удалить чат с Digital Dreams?</p>
        <p>Это действие нельзя будет отменить.</p>
      </div>
      <label className={cl.chatPopupControl}>
        <input type="checkbox" checked={forBoth} onChange={(e) => setForBoth(e.target.checked)} />
        <p>Удалить у меня и у Digital Dreams</p>
      </label>
      <div className={cl.chatPopupButtons}>
        <Button onClick={() => popupChanged(null)}>
          <p>Отмена</p>
        </Button>
        <Button onClick={deleteChat}>
          <p>Удалить</p>
        </Button>
      </div>
    </Popup>
  )
}

export { ChatDeletePopup }
