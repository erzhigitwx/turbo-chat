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
    <Message isOpponent={message.senderId !== user?.uid} {...rest}>
      <p>{message.content}</p>
      <div>
        <p>{formattedTime(message.createdAt)}</p>
        {(message.status === 'send' && <ToCheckImg />) || <CheckedImg />}
      </div>
    </Message>
  )
}

export { ChatMessage }
