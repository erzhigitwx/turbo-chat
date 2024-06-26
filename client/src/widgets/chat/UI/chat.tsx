import cl from './chat.module.scss'
import {ChatList} from './chat-list/chat-list'
import {ChatFrame} from './chat-frame/chat-frame'
import {useNavigate, useSearchParams} from 'react-router-dom'
import {useContext, useEffect, useRef, useState} from 'react'
import {selectedChatChanged} from '@/widgets/chat/model/chat-frame'
import {SocketContext} from '@/app/providers/socket-provider'
import {chatMessageAdded, fetchChatsFx} from '@/widgets/chat/model/chat'
import {Message} from '@/shared/types'
import {useWindowWidth} from '@/shared/hooks/use-window-width'
import {ChatSidebar} from '@/widgets/chat/UI/chat-sidebar/chat-sidebar'
import {useClickAway} from '@/shared/hooks/use-click-away'
import {getCookie} from '@/shared/utils'
import {useSocketListener} from '@/shared/hooks/use-socket-listener'
import {useUserData} from '@/shared/hooks/use-user-data'

const Chat = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const chatId = searchParams.get('chat')
    const chatIdRef = useRef(chatId)
    const socket = useContext(SocketContext)
    const onlineUsersRef = useRef<string[]>([])
    const [typingUsers, setTypingUsers] = useState<string[]>([])
    const [isChatList, setIsChatList] = useState(false)
    const chatListRef = useRef(null)
    const user = useUserData()
    const width = useWindowWidth()
    const isTablet = width <= 1000 && width > 500
    const isMobile = width <= 500

    useEffect(() => {
        if (chatId) {
            selectedChatChanged(chatId)
        }
    }, []);

    useEffect(() => {
        if (chatId) {
            selectedChatChanged(chatId)
            setIsChatList(false)
        }
        chatIdRef.current = chatId
    }, [chatId])

    // SOCKET LISTENERS
    async function refetchChats() {
        await fetchChatsFx()
    }

    const updateOnlineUsersRef = (uid: string) => {
        onlineUsersRef.current = [...onlineUsersRef.current, uid]
    }

    const incomingMessageListener = (data: { message: Message; chatId: string }) => {
        if (!data.message) return
        chatMessageAdded(data)

        if (chatIdRef.current === data.chatId && user?.uid !== data.message.senderId) {
            socket?.emit('select-chat', {
                token: getCookie('token'),
                chatId,
            })
        }
    }

    useSocketListener('incoming-message', async (data: { message: Message; chatId: string }) => {
        incomingMessageListener(data)
        await refetchChats()
    })
    useSocketListener('profile-owner-connect', (data: { uid: string }) => {
        updateOnlineUsersRef(data?.uid)
    })
    useSocketListener('profile-owner-disconnect', (data: { uid: string }) => {
        onlineUsersRef.current = onlineUsersRef.current.filter((userId) => userId !== data?.uid)
    })
    useSocketListener('chat-selected', refetchChats)
    useSocketListener('chat-cleared', refetchChats)
    useSocketListener('chat-deleted', async () => {
        navigate('/')
        selectedChatChanged(null)
        await refetchChats()
    })
    useSocketListener('chat-typing-receive', (data: { chatId: string }) => {
        setTypingUsers((prev) => [...prev, data.chatId])
    })
    useSocketListener('chat-typing-stop', (data: { chatId: string }) => {
        setTypingUsers((prev) => prev.filter((id) => id !== data.chatId))
    })
    // SOCKET LISTENERS

    useClickAway(chatListRef, () => setIsChatList(false))

    return (
        <div className={cl.chat}>
            {/* show sidebar if not computer */}
            {(isTablet || isMobile) && (
                <ChatSidebar
                    onlineUsers={onlineUsersRef.current}
                    setIsChatList={setIsChatList}
                    isChatList={isChatList}
                />
            )}
            {isTablet ? (
                // if tablet, show either with chat-list or without it
                (isChatList && (
                    <div className={cl.chatGroup}>
                        <ChatFrame onlineUsers={onlineUsersRef.current} typingUsers={typingUsers} />
                        <ChatList onlineUsers={onlineUsersRef.current} typingUsers={typingUsers} />
                    </div>
                )) || <ChatFrame onlineUsers={onlineUsersRef.current} typingUsers={typingUsers} />
            ) : isMobile ? (
                // if mobile, show either chat-list or chat-frame
                (isChatList && (
                    <ChatList onlineUsers={onlineUsersRef.current} typingUsers={typingUsers} />
                )) || <ChatFrame onlineUsers={onlineUsersRef.current} typingUsers={typingUsers} />
            ) : (
                <>
                    {/* show just chat-list and chat-frame(default) */}
                    <ChatList onlineUsers={onlineUsersRef.current} typingUsers={typingUsers} />
                    <ChatFrame onlineUsers={onlineUsersRef.current} typingUsers={typingUsers} />
                </>
            )}
        </div>
    )
}

export {Chat}
