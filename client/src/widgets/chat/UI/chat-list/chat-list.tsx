import cl from './chat-list.module.scss'
import clsx from 'clsx'
import { Input } from '@/shared/UI/input/input'
import { Button } from '@/shared/UI/button/button'
import { ChatListItem } from './chat-list-item/chat-list-item'
import SettingsImg from '@/assets/icons/settings.svg?react'
import SearchImg from '@/assets/icons/search.svg?react'
import PlusImg from '@/assets/icons/plus.svg?react'
import { Chat } from '@/shared/types'
import { useUnit } from 'effector-react'
import { ChatListUser } from '@/widgets/chat/UI/chat-list/chat-list-user/chat-list-user'
import {
  $isFetchingUsers,
  $seachValue,
  $searchedChats,
  searchValueChanged,
} from '@/widgets/chat/model/chat-list'
import { $chats } from '@/widgets/chat/model/chat'
import { $selectedChat } from '@/widgets/chat/model/chat-frame'
import { $user } from '@/app/model'

const ChatList = ({ onlineUsers }: { onlineUsers: string[] }) => {
  const chats: Chat[] = useUnit($chats)
  const user = useUnit($user)
  const isFetchingUsers = useUnit($isFetchingUsers)
  const searchValue = useUnit($seachValue)
  const selectedChat = useUnit($selectedChat)
  const searchedUsers = useUnit($searchedChats)
  const isExistingChats = !!searchedUsers?.existingChats.length
  const isSearchResults = !!searchedUsers?.searchResults.length

  return (
    <div className={cl.chatList}>
      <header className={cl.chatListHeader}>
        <div>
          <span>
            <h1>чаты</h1>
            <h3>{chats.length}</h3>
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
        {isSearchResults || isExistingChats ? (
          <>
            {isSearchResults && (
              <div>
                <p>Search results</p>
                {searchedUsers.searchResults.map((user) => (
                  <ChatListUser
                    key={user.uid}
                    user={user}
                    isOnline={onlineUsers.includes(user.uid)}
                  />
                ))}
              </div>
            )}
            {isExistingChats && (
              <div>
                <p>Existing chats</p>
                {searchedUsers.existingChats.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isOnline={onlineUsers.includes(
                      chat.creatorId === user?.uid ? chat.opponentId : chat.creatorId,
                    )}
                  />
                ))}
              </div>
            )}
          </>
        ) : searchValue.length ? (
          <>
            {isFetchingUsers ? (
              <p>Ищем пользователей</p>
            ) : (
              <p>Нет пользователей с такими именами</p>
            )}
          </>
        ) : chats.length ? (
          chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={selectedChat?.id === chat.id}
              isOnline={onlineUsers.includes(
                chat.creatorId === user?.uid ? chat.opponentId : chat.creatorId,
              )}
            />
          ))
        ) : (
          <p>Нет чатов</p>
        )}
      </div>
    </div>
  )
}

export { ChatList }
