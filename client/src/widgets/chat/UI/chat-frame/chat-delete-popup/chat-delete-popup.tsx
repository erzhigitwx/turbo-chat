import cl from './chat-delete-popup.module.scss'
import CrossImg from '@/assets/icons/cross.svg?react'
import { Popup } from '@/shared/UI/popup/popup'
import { Button } from '@/shared/UI'

const ChatDeletePopup = () => {
  return (
    <Popup extraClass={cl.chatPopup}>
      <div className={cl.chatPopupHeader}>
        <h2>Удалить чат</h2>
        <CrossImg />
      </div>
      <div className={cl.chatPopupNotice}>
        <p>Вы точно хотите удалить чат с Digital Dreams?</p>
        <p>Это действие нельзя будет отменить.</p>
      </div>
      <div className={cl.chatPopupControl}>
        <input type="checkbox" />
        <p>Удалить у меня и у Digital Dreams</p>
      </div>
      <div className={cl.chatPopupButtons}>
        <Button>
          <p>Отмена</p>
        </Button>
        <Button>
          <p>Удалить</p>
        </Button>
      </div>
    </Popup>
  )
}

export { ChatDeletePopup }
