import cl from "./frame-header-note.module.scss";
import {Button, Popup, TextArea} from "@/shared/UI";
import {useRef, useState} from "react";
import {Fetch} from "@/shared/utils/methods";
import {getCookie} from "@/shared/utils";
import {useUnit} from "effector-react";
import {$user} from "@/app/model";
import {useClickAway} from "@/shared/hooks/use-click-away";
import {$selectedChat} from "@/widgets/chat/model/chat-frame";
import {FrameHeaderNoteProps} from "../chat-frame-header.props";

const FrameHeaderNote = ({ setIsNotePopup, setIsControlPopup }: FrameHeaderNoteProps) => {
    const user = useUnit($user);
    const selectedChat = useUnit($selectedChat)
    const [note, setNote] = useState(selectedChat?.note && selectedChat?.note[user?.uid as string] || '')
    const notePopupRef = useRef(null)

    useClickAway(notePopupRef, () => setIsNotePopup(false))

    const handleSaveNote = async () => {
        await Fetch(import.meta.env.VITE_API_URL + '/api/chats/manage-chat', {
            method: 'POST',
            body: JSON.stringify({
                node: {
                    note: {
                        [user?.uid as string]: note
                    }
                },
                chatId: selectedChat?.id,
                token: getCookie('token'),
            }),
        })

        setIsNotePopup(false)
    }


    return (
        <Popup
            onClick={() => setIsControlPopup(false)}
            extraClass={cl.note}
            ref={notePopupRef}
        >
            <div>
                <h3>Создание заметки</h3>
                <TextArea
                    extraClass={cl.noteTextarea}
                    placeholder={'Заметка будет видна только вам \n(100 символов)'}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={100}
                    value={note}
                />
                <div>
                    <Button isGrey onClick={() => setIsNotePopup(false)}>
                        Отмена
                    </Button>
                    <Button isBlue onClick={handleSaveNote}>
                        Сохранить
                    </Button>
                </div>
            </div>
        </Popup>
    )
};

export {FrameHeaderNote};