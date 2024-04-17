import { MessageProps } from '@/shared/UI/message/message.props'
import { Message } from '@/shared/types'

export interface ChatMessageProps extends Omit<MessageProps, 'children' | 'isOpponent'> {
  message: Message
}
