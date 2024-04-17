import cl from './chat-message.module.scss'
import { ChatMessageProps } from './chat-message.props'
import { Message } from '@/shared/UI/message/message'
import { useUnit } from 'effector-react'
import { $opponent } from '@/widgets/chat/model/chat'

const ChatMessage = ({ message, ...rest }: ChatMessageProps) => {
  const opponent = useUnit($opponent)

  return (
    <Message isOpponent={message.senderId === opponent?.uid} {...rest}>
      <p>{message.content}</p>
    </Message>
  )
}

export { ChatMessage }
