import { ChangeEvent, Fragment, useContext, useEffect, useRef, useState } from 'react'
import cl from './chat-frame.module.scss'
import { useUnit } from 'effector-react'
import { Button, DropdownMenu, TextArea, TextDivider } from '@/shared/UI'
import SendImg from '@/assets/icons/chat/send.svg?react'
import AttachImg from '@/assets/icons/chat/attach.svg?react'
import ImageImg from '@/assets/icons/chat/image.svg?react'
import FileImg from '@/assets/icons/chat/file.svg?react'
import clsx from 'clsx'
import { $attach, $popup, $selectedChat, attachTypeChanged } from '@/widgets/chat/model/chat-frame'
import { $opponent } from '@/widgets/chat/model/chat'
import { SocketContext } from '@/app/providers/socket-provider'
import { formattedDate, getCookie, groupMessagesByDay } from '@/shared/utils'
import { ChatDeletePopup } from '@/widgets/chat/UI/chat-frame/chat-delete-popup/chat-delete-popup'
import { ChatClearPopup } from '@/widgets/chat/UI/chat-frame/chat-clear-poup/chat-clear-popup'
import { ChatMediaPopup } from '@/widgets/chat/UI/chat-frame/chat-media-popup/chat-media-popup'
import { ChatFrameHeader } from '@/widgets/chat/UI/chat-frame/chat-frame-header/chat-frame-header'
import { Popup } from '@/shared/UI/popup/popup'
import { useClickAway } from '@/shared/hooks/useClickAway'
import { useWindowWidth } from '@/shared/hooks/useWindowWidth'
import { DropdownMenuItem } from '@/shared/UI/dropdown-menu/dropdown-menu.props'
import { ChatMessage } from '@/entities'
import { Message } from '@/shared/UI/message/message'
import { ChatFrameAttach } from '@/widgets/chat/UI/chat-frame/chat-frame-attach/chat-frame-attach'

const ChatFrame = ({ onlineUsers }: { onlineUsers: string[] }) => {
  const popup = useUnit($popup)
  const opponent = useUnit($opponent)
  const selectedChat = useUnit($selectedChat)
  // attach
  const attach = useUnit($attach)
  const attachRef = useRef<HTMLDivElement | null>(null)
  const [isAttachPopup, setIsAttachPopup] = useState(false)
  const socket = useContext(SocketContext)
  // message
  const messagesCnt = useRef<HTMLDivElement | null>(null)
  const groupedMessages = groupMessagesByDay(selectedChat?.messages || [])
  const [message, setMessage] = useState('')
  const [prevMessage, setPrevMessage] = useState(message)
  const [textAreaHeight, setTextAreaHeight] = useState(50)
  const [isOpponentTyping, setIsOpponentTyping] = useState(false)
  const mediaInputRef = useRef<HTMLInputElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const attachLen = attach?.data.length
  const width = useWindowWidth()

  const initialAttachItems: DropdownMenuItem[] = [
    {
      id: 1,
      content: 'Фото или видео',
      onClick: () => {
        attachTypeChanged('media')
        if (fileInputRef.current) {
          fileInputRef.current.multiple = true
          fileInputRef.current?.click()
        }
      },
      icon: ImageImg,
    },
    {
      id: 2,
      content: 'Файл',
      onClick: () => {
        // attachTypeChanged('file')
        // if (mediaInputRef.current) {
        //   mediaInputRef.current.accept = 'image/*,video/*'
        //   mediaInputRef.current.multiple = true
        //   mediaInputRef.current?.click()
        // }
      },
      icon: FileImg,
    },
  ]

  const handleSendMessage = async () => {
    if (!message.trim().length && !attachLen) return
    setMessage('')
    setTextAreaHeight(50)

    socket?.emit('create-message', {
      token: getCookie('token'),
      chatId: selectedChat?.id,
      ...(attach?.data.length ? { attach: attach } : null),
      message: message,
    })
  }

  const handleKeyDown = async (event: any) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      await handleSendMessage()
    } else if (event.key === 'Enter' && event.shiftKey) {
      setTextAreaHeight(textAreaHeight + 14)
    }
  }

  useEffect(() => {
    if (!message) setTextAreaHeight(50)
    if (message.length > 145) setTextAreaHeight(textAreaHeight + 14 * (message.length / 70))
    if (prevMessage.length > message.length) {
      prevMessage.split(message)[1] === '\n' ? setTextAreaHeight(textAreaHeight - 14) : ''
      setPrevMessage(message)
    }
  }, [message])

  useEffect(() => {
    const chatBody = messagesCnt.current

    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight
    }
  }, [selectedChat])

  useEffect(() => {
    socket?.on('chat-typing-receive', () => {
      setIsOpponentTyping(true)
    })
    socket?.on('chat-typing-stop', () => {
      setIsOpponentTyping(false)
    })

    return () => {
      socket?.off('chat-typing-receive', () => {
        setIsOpponentTyping(true)
      })
      socket?.off('chat-typing-stop', () => {
        setIsOpponentTyping(false)
      })
    }
  }, [])

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    if (e.target.value) {
      socket?.emit('typing-chat', {
        token: getCookie('token'),
        chatId: selectedChat?.id,
      })
    } else {
      socket?.emit('stop-typing-chat', {
        token: getCookie('token'),
        chatId: selectedChat?.id,
      })
    }
  }

  useClickAway(attachRef, () => setIsAttachPopup(false))

  return (
    <div className={cl.chatFrame}>
      {opponent ? (
        <>
          {popup === 'delete' && <ChatDeletePopup />}
          {popup === 'clear' && <ChatClearPopup />}
          {popup === 'media' && <ChatMediaPopup />}
          <ChatFrameHeader onlineUsers={onlineUsers} />
          <div className={clsx(cl.chatFrameBody, 'scroll')} ref={messagesCnt}>
            {groupedMessages.map((group, i) => (
              <Fragment key={i}>
                <TextDivider text={formattedDate(group.day)} />
                <div className={cl.chatFrameBodyMessages}>
                  {group?.messages.map((msg) => <ChatMessage message={msg} key={msg.messageId} />)}
                  {isOpponentTyping && (
                    <Message isOpponent extraClass={cl.chatFrameBodyTyping}>
                      <p>Печатает</p>
                      <span className={cl.chatFrameBodyTypingDots}>
                        <span></span>
                        <span></span>
                        <span></span>
                      </span>
                    </Message>
                  )}
                </div>
              </Fragment>
            ))}
          </div>
          <div className={cl.chatFrameControlWrapper}>
            <div className={clsx(cl.chatFrameControl, attachLen && cl.chatFrameControlNoPaddings)}>
              <Button onClick={() => setIsAttachPopup((prev) => !prev)}>
                <AttachImg />
              </Button>
              <TextArea
                extraClass={cl.chatFrameControlInput}
                placeholder={width <= 500 ? 'Написать...' : 'Написать сообщение...'}
                value={message}
                onChange={handleMessageChange}
                style={{ height: `${textAreaHeight}px`, maxHeight: '100px' }}
                onKeyDown={handleKeyDown}
              />
              {message || attachLen ? (
                <Button onClick={handleSendMessage}>
                  <SendImg />
                </Button>
              ) : null}
              {isAttachPopup && (
                <Popup
                  onClick={() => setIsAttachPopup(false)}
                  ref={attachRef}
                  extraClass={clsx(
                    cl.chatFrameAttachPopup,
                    attach?.type === 'media' && attachLen && cl.chatFrameAttachPopupMedia,
                    attach?.type === 'file' && attachLen && cl.chatFrameAttachPopupFile,
                  )}
                >
                  <DropdownMenu items={initialAttachItems} />
                </Popup>
              )}
            </div>
            {attach && (
              <ChatFrameAttach mediaInputRef={mediaInputRef} fileInputRef={fileInputRef} />
            )}
          </div>
        </>
      ) : (
        <div className={cl.chatFrameSelect}>
          <div>
            <SendImg />
          </div>
          <p>Выберите, кому хотите написать</p>
        </div>
      )}
    </div>
  )
}

export { ChatFrame }
