import cl from '@/widgets/chat/UI/chat-frame/chat-frame.module.scss'
import {Avatar, Button, DropdownMenu} from '@/shared/UI'
import {calculateDateDifference, getCookie} from '@/shared/utils'
import {Popup} from '@/shared/UI/popup/popup'
import {useClickAway} from '@/shared/hooks/use-click-away'
import {Fetch} from '@/shared/utils/methods'
import {DropdownMenuItem} from '@/shared/UI/dropdown-menu/dropdown-menu.props'
import SearchImg from '@/assets/icons/chat/search.svg?react'
import NoteImg from '@/assets/icons/chat/note.svg?react'
import DotsImg from '@/assets/icons/chat/dots.svg?react'
import MediaImg from '@/assets/icons/chat/media.svg?react'
import PinImg from '@/assets/icons/chat/pin.svg?react'
import EraserImg from '@/assets/icons/chat/eraser.svg?react'
import TrashImg from '@/assets/icons/chat/trash.svg?react'
import {$selectedChat, popupChanged} from '@/widgets/chat/model/chat-frame'
import {$opponent, fetchChatsFx} from '@/widgets/chat/model/chat'
import {useRef, useState} from 'react'
import {useUnit} from 'effector-react'
import {FrameHeaderNote} from "./frame-header-note/frame-header-note";
import {ChatFrameHeaderProps} from "./chat-frame-header.props";

const ChatFrameHeader = ({onlineUsers}: ChatFrameHeaderProps) => {
    const [isControlPopup, setIsControlPopup] = useState(false)
    const [isNotePopup, setIsNotePopup] = useState(false)
    const opponent = useUnit($opponent)
    const selectedChat = useUnit($selectedChat)
    const popupRef = useRef(null)
    const initialMenuItems: DropdownMenuItem[] = [
        {
            id: 1,
            content: selectedChat?.isPinned ? 'Открепить' : 'Закрепить',
            onClick: async () => {
                await Fetch(import.meta.env.VITE_API_URL + '/api/chats/manage-chat', {
                    method: 'POST',
                    body: JSON.stringify({
                        node: {isPinned: !selectedChat?.isPinned},
                        chatId: selectedChat?.id,
                        token: getCookie('token'),
                    }),
                })

                await fetchChatsFx()
                setIsControlPopup(false)
            },
            icon: PinImg,
        },
        {
            id: 2,
            content: 'Вложения',
            onClick: () => popupChanged('media'),
            icon: MediaImg,
        },
        {
            id: 3,
            content: 'Очистить переписку',
            onClick: () => popupChanged('clear'),
            icon: EraserImg,
        },
        {
            id: 4,
            content: 'Удалить чат',
            onClick: () => popupChanged('delete'),
            icon: TrashImg,
        },
    ]

    useClickAway(popupRef, () => setIsControlPopup(false))

    return (
        opponent && (
            <header className={cl.chatFrameHeader}>
                <div className={cl.chatFrameHeaderInfo}>
                    <Avatar isActive={onlineUsers.includes(opponent.uid)} src={opponent.avatar}/>
                    <div>
                        <h6>{opponent.login}</h6>
                        {opponent.uid && onlineUsers.includes(opponent.uid) ? (
                            <p className={cl.chatFrameHeaderInfoOnline}>Онлайн</p>
                        ) : (
                            <p>{calculateDateDifference(opponent.lastLoginAt)}</p>
                        )}
                    </div>
                </div>
                <div className={cl.chatFrameHeaderOptions}>
                    <Button>
                        <SearchImg className={'blue-stroke-hover'}/>
                    </Button>
                    <Button onClick={() => setIsNotePopup((prev) => !prev)}>
                        <NoteImg className={'blue-stroke-hover'}/>
                    </Button>
                    <Button onClick={() => setIsControlPopup((prev) => !prev)}>
                        <DotsImg className={'blue-stroke-hover'}/>
                    </Button>
                    {isControlPopup && (
                        <Popup
                            onClick={() => setIsControlPopup(false)}
                            extraClass={cl.chatFrameHeaderOptionsPopup}
                            ref={popupRef}
                        >
                            <DropdownMenu items={initialMenuItems}/>
                        </Popup>
                    )}
                    {isNotePopup &&
                        <FrameHeaderNote setIsControlPopup={setIsControlPopup} setIsNotePopup={setIsNotePopup}/>}
                </div>
            </header>
        )
    )
}

export {ChatFrameHeader}
