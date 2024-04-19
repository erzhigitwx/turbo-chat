import { useContext, useState } from 'react'
import cl from './chat-frame.module.scss'
import { useUnit } from 'effector-react'
import { Chat, UserData } from '@/shared/types'
import { Avatar, Button, Input } from '@/shared/UI'
import SearchImg from '@/../public/icons/chat/search.svg?react'
import NoteImg from '@/../public/icons/chat/note.svg?react'
import DotsImg from '@/../public/icons/chat/dots.svg?react'
import SendImg from '@/../public/icons/chat/send.svg?react'
import clsx from 'clsx'
import { $selectedChat } from '@/widgets/chat/model/chat-frame'
import { $opponent, fetchChatsFx } from '@/widgets/chat/model/chat'
import { ChatMessage } from '@/entities/chat-message/chat-message'
import { SocketContext } from '@/app/providers/socket-provider'
import { calculateDateDifference, getCookie } from '@/shared/utils'

const ChatFrame = ({ onlineUsers }: { onlineUsers: string[] }) => {
  const [message, setMessage] = useState('')
  const selectedChat: Chat | null = useUnit($selectedChat)
  const opponent: UserData | null = useUnit($opponent)
  const socket = useContext(SocketContext)

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
          <header className={cl.chatFrameHeader}>
            <div className={cl.chatFrameHeaderInfo}>
              <Avatar isActive={onlineUsers.includes(opponent.uid)} />
              <div>
                <h6>{opponent.login}</h6>
                {onlineUsers.includes(opponent.uid) ? (
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
              <Button>
                <DotsImg className={'blue-stroke-hover'} />
              </Button>
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage()
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
