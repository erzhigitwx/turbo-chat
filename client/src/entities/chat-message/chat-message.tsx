import cl from './chat-message.module.scss'
import { ChatMessageProps } from './chat-message.props'
import { Message } from '@/shared/UI/message/message'
import { useUnit } from 'effector-react'
import { $user } from '@/app/model'
import { formattedTime } from '@/shared/utils'
import ToCheckImg from '@/assets/icons/toCheck.svg?react'
import CheckedImg from '@/assets/icons/checked.svg?react'

const ChatMessage = ({ message, ...rest }: ChatMessageProps) => {
  const user = useUnit($user)

  return (
    <Message isOpponent={message.senderId !== user?.uid} extraClass={cl.chatMessage} {...rest}>
      <p className={cl.chatMessageText}>{message.content}</p>
      <div className={cl.chatMessageDate}>
        <p>{formattedTime(message.createdAt)}</p>
        {(message.status === 'send' && <ToCheckImg />) || <CheckedImg />}
      </div>
    </Message>
  )
}

export { ChatMessage }
