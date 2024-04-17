import cl from './message.module.scss'
import { MessageProps } from '@/shared/UI/message/message.props'
import clsx from 'clsx'

const Message = ({
  children,
  extraClass,
  isOpponent,
  padding = 'large',
  ...rest
}: MessageProps) => {
  const isSmall = padding === 'small'
  const isMedium = padding === 'medium'
  const isLarge = padding === 'large'

  return (
    <div
      className={clsx(
        cl.message,
        isOpponent && cl.messageSender,
        isSmall && cl.messageSmall,
        isMedium && cl.messageMedium,
        isLarge && cl.messageLarge,
        extraClass,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export { Message }
