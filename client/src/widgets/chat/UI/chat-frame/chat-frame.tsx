import { useContext, useState } from 'react'
import cl from './chat-frame.module.scss'
import { useUnit } from 'effector-react'
import { Avatar, Button, Input } from '@/shared/UI'
import SearchImg from '@/assets/icons/chat/search.svg?react'
import NoteImg from '@/assets/icons/chat/note.svg?react'
import DotsImg from '@/assets/icons/chat/dots.svg?react'
import SendImg from '@/assets/icons/chat/send.svg?react'
import MediaImg from '@/assets/icons/chat/media.svg?react'
import EraserImg from '@/assets/icons/chat/eraser.svg?react'
import TrashImg from '@/assets/icons/chat/trash.svg?react'
import clsx from 'clsx'
import { $popup, $selectedChat, popupChanged } from '@/widgets/chat/model/chat-frame'
import { $opponent } from '@/widgets/chat/model/chat'
import { ChatMessage } from '@/entities/chat-message/chat-message'
import { SocketContext } from '@/app/providers/socket-provider'
import { calculateDateDifference, getCookie } from '@/shared/utils'
import { Popup } from '@/shared/UI/popup/popup'
import { DropdownMenuItem } from '@/shared/UI/dropdown-menu/UI/dropdown-menu.props'
import { DropdownMenu } from '@/shared/UI/dropdown-menu'
import { ChatDeletePopup } from '@/widgets/chat/UI/chat-frame/chat-delete-popup/chat-delete-popup'

const ChatFrame = ({ onlineUsers }: { onlineUsers: string[] }) => {
  const [message, setMessage] = useState('')
  const [isPopup, setIsPopup] = useState(true)
  const popup = useUnit($popup)
  const opponent = useUnit($opponent)
  const selectedChat = useUnit($selectedChat)
  const socket = useContext(SocketContext)
  const [menuItems, setMenuItems] = useState<DropdownMenuItem[]>([
    {
      isSelected: false,
      id: 1,
      content: 'Вложения',
      onClick: popupChanged('media'),
      icon: MediaImg,
    },
    {
      isSelected: false,
      id: 2,
      content: 'Очистить переписку',
      onClick: popupChanged('clear'),
      icon: EraserImg,
    },
    {
      isSelected: false,
      id: 3,
      content: 'Удалить чат',
      onClick: popupChanged('delete'),
      icon: TrashImg,
    },
  ])

  const handleSendMessage = async () => {
    if (!message.trim().length) return
    setMessage('')

    socket?.emit('create-message', {
      token: getCookie('token'),
      chatId: selectedChat?.id,
      message: message,
    })
  }

  return (
    <div className={cl.chatFrame}>
      {opponent ? (
        <>
          {popup === 'delete' && <ChatDeletePopup />}
          <header className={cl.chatFrameHeader}>
            <div className={cl.chatFrameHeaderInfo}>
              <Avatar isActive={onlineUsers.includes(opponent.uid)} />
              <div>
                <h6>{opponent.login}</h6>
                {opponent.uid && onlineUsers.includes(opponent.uid) ? (
                  <p className={cl.chatFrameHeaderInfoOnline}>Онлайн</p>
                ) : (
                  <p>{calculateDateDifference(opponent.lastLoginAt)}</p>
                )}
              </div>
            </div>
            <div className={cl.chatFrameHeaderOptions}>
              <Button>
                <SearchImg className={'blue-stroke-hover'} />
              </Button>
              <Button>
                <NoteImg className={'blue-stroke-hover'} />
              </Button>
              <Button onClick={() => setIsPopup((prev) => !prev)}>
                <DotsImg className={'blue-stroke-hover'} />
              </Button>
              {isPopup && (
                <Popup extraClass={cl.chatFrameHeaderOptionsPopup}>
                  <DropdownMenu items={menuItems} setItems={setMenuItems} />
                </Popup>
              )}
            </div>
          </header>
          <div className={clsx(cl.chatFrameBody, 'scroll')}>
            {selectedChat?.messages.map((msg) => <ChatMessage message={msg} key={msg.messageId} />)}
          </div>
          <div className={cl.chatFrameControl}>
            <Input
              extraClass={cl.chatFrameControlInput}
              placeholder={'Написать сообщение...'}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') await handleSendMessage()
              }}
            />
            <Button onClick={handleSendMessage}>
              <SendImg />
            </Button>
          </div>
        </>
      ) : (
        <div>Loading</div>
      )}
    </div>
  )
}

export { ChatFrame }
