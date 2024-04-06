import cl from './chat-frame.module.scss'
import { useUnit } from 'effector-react'
import { $opponent, $selectedChat } from '@/widgets/chat/model'
import { Chat, UserData } from '@/shared/types'
import { Avatar, Button, Input } from '@/shared/UI'
import SearchImg from '@/../public/icons/chat/search.svg?react'
import NoteImg from '@/../public/icons/chat/note.svg?react'
import DotsImg from '@/../public/icons/chat/dots.svg?react'
import SendImg from '@/../public/icons/chat/send.svg?react'
import clsx from 'clsx'

const ChatFrame = () => {
  const selectedChat: Chat | null = useUnit($selectedChat)
  const opponent: UserData | null = useUnit($opponent)

  return (
    <div className={cl.chatFrame}>
      {opponent ? (
        <>
          <header className={cl.chatFrameHeader}>
            <div className={cl.chatFrameHeaderInfo}>
              <Avatar />
              <div>
                <h6>{opponent.login}</h6>
                <p>Онлайн</p>
              </div>
            </div>
            <div className={cl.chatFrameHeaderOptions}>
              <Button>
                <SearchImg className={'blue-stroke-hover'} />
              </Button>
              <Button>
                <NoteImg className={'blue-stroke-hover'} />
              </Button>
              <Button>
                <DotsImg className={'blue-stroke-hover'} />
              </Button>
            </div>
          </header>
          <div className={clsx(cl.chatFrameBody, 'custom-scroll')}>1</div>
          <div className={cl.chatFrameControl}>
            <Input extraClass={cl.chatFrameControlInput} placeholder={'Написать сообщение...'} />
            <Button>
              <SendImg />
            </Button>
          </div>
        </>
      ) : (
        <div>Loading</div>
      )}
    </div>
  )
}

export { ChatFrame }
