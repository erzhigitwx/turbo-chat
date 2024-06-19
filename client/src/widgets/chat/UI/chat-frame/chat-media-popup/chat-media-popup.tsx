import cl from '@/widgets/chat/UI/chat-frame/chat-frame-popup.module.scss'
import CrossImg from '@/assets/icons/cross.svg?react'
import NoChats from '@/assets/icons/no-chats.svg?react'
import {$selectedChat, popupChanged} from '@/widgets/chat/model/chat-frame'
import {Button} from '@/shared/UI'
import {Popup} from '@/shared/UI/popup/popup'
import {useEffect, useState} from "react";
import {Fetch} from "@/shared/utils/methods";
import {getCookie} from "@/shared/utils";
import {useUnit} from "effector-react";
import {Message} from "@/shared/types";
import clsx from "clsx";

const ChatMediaPopup = () => {
    const [media, setMedia] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activePhoto, setActivePhoto] = useState<string | null>(null)
    const selectedChat = useUnit($selectedChat);

    useEffect(() => {
        const getMedia = async () => {
            setIsLoading(true)
            const {data} = await Fetch(import.meta.env.VITE_API_URL + '/api/chats/get-chat-media', {
                method: 'POST',
                body: JSON.stringify({
                    chatId: selectedChat?.id,
                    token: getCookie('token'),
                }),
            })
            setMedia(data)
            setIsLoading(false)
        }

        getMedia()
    }, [])

    return (
        <Popup
            extraClass={clsx(cl.chatPopup, cl.chatPopupMedia, "scroll")}
            onClick={() => popupChanged(null)}
            isCentered
            withShadow
        >
            <div className={cl.chatPopupHeader} onClick={(e) => e.stopPropagation()}>
                <h2>Медиа</h2>
                <Button onClick={() => popupChanged(null)}>
                    <CrossImg/>
                </Button>
            </div>
            {activePhoto && (
                <Popup
                    onClick={() => setActivePhoto(null)}
                    extraClass={cl.chatPopupMediaActive}
                    isCentered
                    withShadow
                >
                    <img src={activePhoto!} alt={'active photo'}/>
                </Popup>
            )}
            <div className={cl.chatPopupMediaContent}>
                {isLoading ? (
                        <div className={cl.center}>
                            <p>Загружаем...</p>
                        </div>
                    ) :
                    media.length ? media?.map(msg => (
                        <div key={msg.messageId}>
                            {msg.attach?.map(img => (
                                <img
                                    src={img as string}
                                    alt={img as string}
                                    key={img as string}
                                    onClick={() => setActivePhoto(img as string)}
                                />
                            ))}
                        </div>
                    )) : (
                        <div className={cl.center}>
                            <NoChats className={'theme-fill'}/>
                            <p>Нет медиа</p>
                        </div>
                    )
                }
            </div>
            <div className={cl.chatPopupButtons}>
                <Button onClick={() => popupChanged(null)}>
                    <p>Отмена</p>
                </Button>
            </div>
        </Popup>
    )
}

export {ChatMediaPopup}
