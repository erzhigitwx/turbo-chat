import cl from './chat-list-item.module.scss'
import { Avatar } from '@/shared/UI'
import PinImg from '@/../public/icons/pin.svg?react'
import ToCheckImg from '@/../public/icons/toCheck.svg?react'
import CheckedImg from '@/../public/icons/checked.svg?react'
import { Link } from 'react-router-dom'
import { Chat, UserData } from '@/shared/types'
import { memo, useEffect, useState } from 'react'
import { Fetch } from '@/shared/utils/methods'
import { getCookie } from '@/shared/utils'
import clsx from 'clsx'
import { searchValueChanged } from '@/widgets/chat/model/chat-list'

const ChatListItem = memo(({ chat, isActive }: { chat: Chat; isActive?: boolean }) => {
  const [opponent, setOpponent] = useState<UserData | null>(null)

  useEffect(() => {
    const getOpponentData = async () => {
      const { data } = await Fetch('http://localhost:5000/api/users/get-user', {
        method: 'POST',
        body: JSON.stringify({
          opponentId: chat.opponentId,
          token: getCookie('token'),
        }),
      })
      setOpponent(data)
    }

    getOpponentData()
  }, [])
  let pinned = true
  let status = 'send'
  const unCheckedMsg = 10

  return (
    <Link
      className={clsx(cl.chatListItem, isActive && cl.chatListItemActive)}
      to={`/?chat=${chat.id}`}
      onClick={() => {
        searchValueChanged('')
      }}
    >
      <Avatar size={[50, 50]} />
      <div className={cl.chatListItemCol}>
        <div className={cl.chatListItemRow}>
          <h6>{opponent?.login}</h6>
          <span>
            <li>17:22</li>
            {pinned && <PinImg />}
          </span>
        </div>
        <div className={cl.chatListItemRow}>
          <p>Текст сообщения текст сообщения текст сообщения</p>
          {!unCheckedMsg ? (
            (status === 'send' && <ToCheckImg />) || (status === 'checked' && <CheckedImg />)
          ) : (
            <span className={cl.chatListItemRowUnchecked}>{11}</span>
          )}
        </div>
      </div>
    </Link>
  )
})

export { ChatListItem }
