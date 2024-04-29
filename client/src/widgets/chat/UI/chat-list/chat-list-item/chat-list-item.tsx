import cl from './chat-list-item.module.scss'
import { Avatar } from '@/shared/UI'
import PinImg from '@/assets/icons/pin.svg?react'
import ToCheckImg from '@/assets/icons/toCheck.svg?react'
import CheckedImg from '@/assets/icons/checked.svg?react'
import { Link } from 'react-router-dom'
import { Chat, UserData } from '@/shared/types'
import { memo, useEffect, useState } from 'react'
import { Fetch } from '@/shared/utils/methods'
import { formattedTime, getCookie } from '@/shared/utils'
import clsx from 'clsx'
import { searchValueChanged } from '@/widgets/chat/model/chat-list'

const ChatListItem = memo(
  ({ chat, isActive, isOnline }: { chat: Chat; isActive?: boolean; isOnline: boolean }) => {
    const [opponent, setOpponent] = useState<UserData | null>(null)
    const msgLength = chat.messages.length

    useEffect(() => {
      const getOpponentData = async () => {
        const { data } = await Fetch('http://localhost:5000/api/users/get-user', {
          method: 'POST',
          body: JSON.stringify({
            id: chat.opponentId,
            token: getCookie('token'),
          }),
        })
        setOpponent(data)
      }

      getOpponentData()
    }, [])
    let status = 'send'

    return (
      <Link
        className={clsx(cl.chatListItem, isActive && cl.chatListItemActive)}
        to={`/?chat=${chat.id}`}
        onClick={() => {
          searchValueChanged('')
        }}
      >
        <Avatar size={[40, 40]} isActive={isOnline} />
        <div className={cl.chatListItemCol}>
          <div className={cl.chatListItemRow}>
            <h6>{opponent?.login}</h6>
            <span>
              {msgLength ? <li>{formattedTime(chat.messages[msgLength - 1].createdAt)}</li> : null}
              {chat.isPinned && <PinImg />}
            </span>
          </div>
          <div className={cl.chatListItemRow}>
            <p>{msgLength ? chat.messages[msgLength - 1].content : 'Новый чат'}</p>
            {chat.unread ? (
              <span className={cl.chatListItemRowUnchecked}>{chat.unread}</span>
            ) : (
              (status === 'send' && <ToCheckImg />) || (status === 'checked' && <CheckedImg />)
            )}
          </div>
        </div>
      </Link>
    )
  },
)

export { ChatListItem }
