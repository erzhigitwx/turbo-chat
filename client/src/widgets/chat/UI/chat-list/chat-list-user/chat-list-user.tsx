import cl from './chat-list-user.module.scss'
import { Avatar } from '@/shared/UI'
import { UserData } from '@/shared/types'
import { useNavigate } from 'react-router-dom'
import { fetchChatsFx, fetchCreatedChatFx } from '@/widgets/chat/model/chat'
import { searchValueChanged } from '@/widgets/chat/model/chat-list'

const ChatListUser = ({ user, isOnline }: { user: UserData; isOnline: boolean }) => {
  const navigate = useNavigate()

  const handleCreateChat = async () => {
    const res = await fetchCreatedChatFx(user.uid)
    if (res.success) {
      await fetchChatsFx()
      navigate(`/?chat=${res.data.id}`)
      searchValueChanged('')
    }
  }

  return (
    <div className={cl.chatListItem} onClick={handleCreateChat}>
      <Avatar size={[40, 40]} isActive={isOnline} />
      <div className={cl.chatListItemCol}>
        <div className={cl.chatListItemRow}>
          <h6>{user.login}</h6>
          <span>
            <li>17:22</li>
          </span>
        </div>
        <div className={cl.chatListItemRow}>
          <p>Новый чат</p>
        </div>
      </div>
    </div>
  )
}

export { ChatListUser }
