import cl from './chat-list-user.module.scss'
import { Avatar } from '@/shared/UI'
import { UserData } from '@/shared/types'
import { fetchCreatedChatFx, searchValueChanged } from '@/widgets/chat/model'
import { useNavigate } from 'react-router-dom'

const ChatListUser = ({ user }: { user: UserData }) => {
  const navigate = useNavigate()

  const handleCreateChat = async () => {
    const res = await fetchCreatedChatFx(user.uid)

    if (res.success) {
      navigate(`/?opponent-id=${user.uid}`)
      searchValueChanged('')
    }
  }

  return (
    <div className={cl.chatListItem} onClick={handleCreateChat}>
      <Avatar size={[50, 50]} />
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
