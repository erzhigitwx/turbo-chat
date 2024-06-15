import cl from './chat-message.module.scss'
import { ChatMessageProps } from './chat-message.props'
import { Message } from '@/shared/UI/message/message'
import { formattedTime } from '@/shared/utils'
import ToCheckImg from '@/assets/icons/toCheck.svg?react'
import CheckedImg from '@/assets/icons/checked.svg?react'
import clsx from 'clsx'
import { useState } from 'react'
import { Popup } from '@/shared/UI'
import { useUserData } from '@/shared/hooks/use-user-data'

const ChatMessage = ({ message, ...rest }: ChatMessageProps) => {
  const user = useUserData()
  const [activePhoto, setActivePhoto] = useState<string | null>(null)
  const attachLen = message.attach?.length as number

  if (message.type === 'text') {
    return (
      <Message isOpponent={message.senderId !== user?.uid} extraClass={cl.chatMessage} {...rest}>
        <p className={cl.chatMessageText}>{message.content}</p>
        <div className={cl.chatMessageDate}>
          <p>{formattedTime(message.createdAt)}</p>
          {(message.status === 'send' && <ToCheckImg />) || <CheckedImg />}
        </div>
      </Message>
    )
  } else if (message.type === 'media') {
    return (
      <Message
        isOpponent={message.senderId !== user?.uid}
        extraClass={cl.chatMessageMedia}
        padding={'small'}
        {...rest}
      >
        {activePhoto && (
          <Popup
            onClick={() => setActivePhoto(null)}
            extraClass={cl.chatMessageMediaPopup}
            isCentered
            withShadow
          >
            <img src={activePhoto!} alt={'active photo'} />
          </Popup>
        )}
        <div
          className={clsx(
            cl.mediaBox,
            attachLen === 1 && cl.mediaBoxOne,
            attachLen === 2 && cl.mediaBoxTwo,
            attachLen === 3 && cl.mediaBoxThree,
            attachLen === 4 && cl.mediaBoxFour,
            attachLen === 5 && cl.mediaBoxFive,
          )}
        >
          {message.type === 'media' &&
            message.attach?.map((img) => (
              <div onClick={() => setActivePhoto(img as string)} key={img as string}>
                <img className={cl.mediaBoxImg} src={img as string} alt={img as string} />
              </div>
            ))}
        </div>
        {message.content ? (
          <div className={cl.chatMessageInner}>
            <p className={cl.chatMessageText}>{message.content}</p>
            <div className={cl.chatMessageDate}>
              <p>{formattedTime(message.createdAt)}</p>
              {(message.status === 'send' && <ToCheckImg />) || <CheckedImg />}
            </div>
          </div>
        ) : (
          <div className={cl.chatMessageDateMedia}>
            <p>{formattedTime(message.createdAt)}</p>
            {(message.status === 'send' && <ToCheckImg />) || <CheckedImg />}
          </div>
        )}
      </Message>
    )
  }
  return null
}

export { ChatMessage }
