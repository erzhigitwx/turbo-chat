import cl from './chat-message.module.scss'
import { ChatMessageProps } from './chat-message.props'
import { Message } from '@/shared/UI/message/message'
import { useUnit } from 'effector-react'
import { $user } from '@/app/model'

const ChatMessage = ({ message, ...rest }: ChatMessageProps) => {
  const user = useUnit($user)

  return (
    <Message isOpponent={message.senderId !== user?.uid} {...rest}>
      <p>{message.content}</p>
    </Message>
  )
}

export { ChatMessage }
