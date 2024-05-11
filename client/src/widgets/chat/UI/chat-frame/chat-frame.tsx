import { useContext, useEffect, useState } from 'react'
import cl from './chat-frame.module.scss'
import { useUnit } from 'effector-react'
import { Button, TextArea } from '@/shared/UI'
import SendImg from '@/assets/icons/chat/send.svg?react'
import clsx from 'clsx'
import { $popup, $selectedChat } from '@/widgets/chat/model/chat-frame'
import { $opponent } from '@/widgets/chat/model/chat'
import { ChatMessage } from '@/entities/chat-message/chat-message'
import { SocketContext } from '@/app/providers/socket-provider'
import { getCookie } from '@/shared/utils'
import { ChatDeletePopup } from '@/widgets/chat/UI/chat-frame/chat-delete-popup/chat-delete-popup'
import { ChatClearPopup } from '@/widgets/chat/UI/chat-frame/chat-clear-poup/chat-clear-popup'
import { ChatMediaPopup } from '@/widgets/chat/UI/chat-frame/chat-media-popup/chat-media-popup'
import { ChatFrameHeader } from '@/widgets/chat/UI/chat-frame/chat-frame-header/chat-frame-header'

const ChatFrame = ({ onlineUsers }: { onlineUsers: string[] }) => {
  const popup = useUnit($popup)
  const opponent = useUnit($opponent)
  const selectedChat = useUnit($selectedChat)
  const socket = useContext(SocketContext)
  const [message, setMessage] = useState('')
  const [prevMessage, setPrevMessage] = useState(message)
  const [textAreaHeight, setTextAreaHeight] = useState(50)

  const handleSendMessage = async () => {
    if (!message.trim().length) return
    setMessage('')
    setTextAreaHeight(50)

    socket?.emit('create-message', {
      token: getCookie('token'),
      chatId: selectedChat?.id,
      message: message,
    })
  }

  useEffect(() => {
    if (!message) setTextAreaHeight(50)
    if (message.length > 145) setTextAreaHeight(textAreaHeight + 14 * (message.length / 70))
    if (prevMessage.length > message.length) {
      prevMessage.split(message)[1] === '\n' ? setTextAreaHeight(textAreaHeight - 14) : ''
      setPrevMessage(message)
    }
  }, [message])

  const handleKeyDown = async (event: any) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      await handleSendMessage()
    } else if (event.key === 'Enter' && event.shiftKey) {
      setTextAreaHeight(textAreaHeight + 14)
    }
  }

  return (
    <div className={cl.chatFrame}>
      {opponent ? (
        <>
          {popup === 'delete' && <ChatDeletePopup />}
          {popup === 'clear' && <ChatClearPopup />}
          {popup === 'media' && <ChatMediaPopup />}
          <ChatFrameHeader onlineUsers={onlineUsers} />
          <div className={clsx(cl.chatFrameBody, 'scroll')}>
            {selectedChat?.messages.map((msg) => <ChatMessage message={msg} key={msg.messageId} />)}
          </div>
          <div className={cl.chatFrameControl}>
            <TextArea
              extraClass={cl.chatFrameControlInput}
              placeholder={'Написать сообщение...'}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ height: `${textAreaHeight}px`, maxHeight: '100px' }}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleSendMessage}>
              <SendImg />
            </Button>
          </div>
        </>
      ) : (
        <div>select chat</div>
      )}
    </div>
  )
}

export { ChatFrame }
