import cl from './chat-list-item.module.scss'
import { Avatar } from '@/shared/UI'
import PinImg from '@/assets/icons/pin.svg?react'
import ToCheckImg from '@/assets/icons/toCheck.svg?react'
import CheckedImg from '@/assets/icons/checked.svg?react'
import { Link } from 'react-router-dom'
import { Chat, UserData } from '@/shared/types'
import { memo, useContext, useEffect, useState } from 'react'
import { formattedTime, getCookie } from '@/shared/utils'
import clsx from 'clsx'
import { searchValueChanged } from '@/widgets/chat/model/chat-list'
import { SocketContext } from '@/app/providers/socket-provider'
import { Fetch } from '@/shared/utils/methods'
import { useUnit } from 'effector-react'
import { $user } from '@/app/model'

const ChatListItem = memo(
  ({
    chat,
    isActive,
    isOnline,
    opponentTyping,
  }: {
    chat: Chat
    isOnline: boolean
    isActive?: boolean
    opponentTyping?: boolean
  }) => {
    const [opponent, setOpponent] = useState<UserData | null>(null)
    const socket = useContext(SocketContext)
    const msgLength = chat.messages.length
    const user = useUnit($user)

    useEffect(() => {
      const getOpponentData = async () => {
        const { data } = await Fetch(import.meta.env.VITE_API_URL + '/api/users/get-user', {
          method: 'POST',
          body: JSON.stringify({
            id: chat.opponentId === user?.uid ? chat.creatorId : chat.opponentId,
            token: getCookie('token'),
          }),
        })
        setOpponent(data)
      }

      getOpponentData()
    }, [])

    const handleSelectChat = () => {
      socket?.emit('select-chat', {
        token: getCookie('token'),
        chatId: chat.id,
      })
    }

    return (
      <Link
        className={clsx(
          cl.chatListItem,
          isActive && cl.chatListItemActive,
          chat.isPinned && cl.chatListItemPinned,
        )}
        to={`/?chat=${chat.id}`}
        onClick={() => {
          handleSelectChat()
          searchValueChanged('')
        }}
      >
        <Avatar size={[40, 40]} isActive={isOnline} src={opponent?.avatar} />
        <div className={cl.chatListItemCol}>
          <div className={cl.chatListItemRow}>
            <h6>{opponent?.login}</h6>
            <span>
              {msgLength ? <li>{formattedTime(chat.messages[msgLength - 1].createdAt)}</li> : null}
              {chat.isPinned && <PinImg />}
            </span>
          </div>
          <div className={cl.chatListItemRow}>
            {opponentTyping ? (
              <div className={cl.opponentTyping}>
                <p className={cl.opponentTypingText}>Печатает</p>
                <span className={cl.opponentTypingDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
            ) : msgLength ? (
              <p
                className={clsx(
                  chat.messages[msgLength - 1].senderId !== user?.uid &&
                    cl.chatListItemRowOpponentMsg,
                )}
              >
                {chat.messages[msgLength - 1].type === 'text' &&
                  chat.messages[msgLength - 1].content}
                {chat.messages[msgLength - 1].type === 'media' && 'Фотографии'}
              </p>
            ) : (
              <p>Новый чат</p>
            )}
            {msgLength && !opponentTyping ? (
              <>
                {chat.unread > 0 && chat.messages[msgLength - 1].senderId === opponent?.uid ? (
                  <span className={cl.chatListItemRowUnchecked}>{chat.unread}</span>
                ) : chat.messages[msgLength - 1]?.status === 'send' ? (
                  <ToCheckImg />
                ) : (
                  <CheckedImg />
                )}
              </>
            ) : null}
          </div>
        </div>
      </Link>
    )
  },
)

export { ChatListItem }
