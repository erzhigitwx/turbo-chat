import cl from './chat-list-item.module.scss'
import { Avatar } from '@/shared/UI'
import PinImg from '@/../public/icons/pin.svg?react'
import ToCheckImg from '@/../public/icons/toCheck.svg?react'
import CheckedImg from '@/../public/icons/checked.svg?react'
import { Link, useSearchParams } from 'react-router-dom'
import { Chat } from '@/shared/types'

const ChatListItem = ({ chat }: { chat: Chat }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  let pinned = true
  let status = 'send'
  const unCheckedMsg = 10

  return (
    <Link className={cl.chatListItem} to={`/?opponent-id=${chat.opponentId}`}>
      <Avatar size={[40, 40]} />
      <div className={cl.chatListItemCol}>
        <div className={cl.chatListItemRow}>
          <h6>Антон</h6>
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
}

export { ChatListItem }
