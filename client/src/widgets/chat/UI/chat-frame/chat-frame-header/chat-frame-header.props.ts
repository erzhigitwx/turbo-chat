import {Dispatch, SetStateAction} from "react";

export interface ChatFrameHeaderProps{
    onlineUsers: string[]
}

export interface FrameHeaderNoteProps{
    setIsNotePopup: Dispatch<SetStateAction<boolean>>
    setIsControlPopup: Dispatch<SetStateAction<boolean>>
}