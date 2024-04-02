import cl from './chat-list.module.scss'
import clsx from 'clsx'
import { Input } from '@/shared/UI/input/input'
import { Button } from '@/shared/UI/button/button'
import { ChatListItem } from './chat-list-item/chat-list-item'
import SettingsImg from '@/../public/icons/settings.svg?react'
import SearchImg from '@/../public/icons/search.svg?react'
import PlusImg from '@/../public/icons/plus.svg?react'
import { Chat, UserData } from '@/shared/types'
import { useUnit } from 'effector-react'
import { $chats, $seachValue, $searchedChats, searchValueChanged } from '@/widgets/chat/model'
import { ChatListUser } from '@/widgets/chat/UI/chat-list/chat-list-user/chat-list-user'

const ChatList = () => {
  const chats: Chat[] = useUnit($chats)
  const searchedUsers: UserData[] = useUnit($searchedChats)
  const searchValue = useUnit($seachValue)

  return (
    <div className={cl.chatList}>
      <header className={cl.chatListHeader}>
        <div>
          <span>
            <h1>чаты</h1>
            <h3>32</h3>
          </span>
          <ul>
            <Button>
              <SettingsImg className={'blue-fill-hover'} />
            </Button>
            <Button>
              <PlusImg className={'blue-stroke-hover'} />
            </Button>
          </ul>
        </div>
        <Input
          placeholder={'Поиск'}
          labelImg={<SearchImg />}
          value={searchValue}
          onChange={(e) => searchValueChanged(e.target.value)}
        />
      </header>
      <div className={clsx(cl.chatListBody, 'scroll')}>
        {searchedUsers.length ? (
          searchedUsers.map((user) => <ChatListUser key={user.uid} user={user} />)
        ) : searchValue.length ? (
          <p>Нет пользователей с такими именами</p>
        ) : chats.length ? (
          chats.map((chat) => <ChatListItem key={chat.id} chat={chat} />)
        ) : (
          <p>Нет чатов</p>
        )}
      </div>
    </div>
  )
}

export { ChatList }
