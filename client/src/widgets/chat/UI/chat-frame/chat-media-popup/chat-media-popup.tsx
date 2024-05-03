import cl from '@/widgets/chat/UI/chat-frame/chat-frame-popup.module.scss'
import CrossImg from '@/assets/icons/cross.svg?react'
import { popupChanged } from '@/widgets/chat/model/chat-frame'
import { Button } from '@/shared/UI'
import { Popup } from '@/shared/UI/popup/popup'

const ChatMediaPopup = () => {
  return (
    <Popup extraClass={cl.chatPopup} onClick={() => popupChanged(null)} isCentered withShadow>
      <div className={cl.chatPopupHeader} onClick={(e) => e.stopPropagation()}>
        <h2>Медиа</h2>
        <Button onClick={() => popupChanged(null)}>
          <CrossImg />
        </Button>
      </div>
      <div className={cl.chatPopupNotice}>
        <p>Очистить чат с Digital Dreams?</p>
        <p>Это действие нельзя будет отменить.</p>
      </div>
      <label className={cl.chatPopupControl}>
        <input type="checkbox" />
        <p>Очистить у меня и у Digital Dreams</p>
      </label>
      <div className={cl.chatPopupButtons}>
        <Button onClick={() => popupChanged(null)}>
          <p>Отмена</p>
        </Button>
      </div>
    </Popup>
  )
}

export { ChatMediaPopup }
