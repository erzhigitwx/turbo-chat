export interface UserData {
  uid: string
  login: string
  email: string
  createdAt: string
  lastLoginAt: number
  nickname?: string
  password?: string
  method: 'default' | 'google' | 'github'
}

export interface UserDataFull {
  user: UserData
  method: 'email' | 'google' | 'github'
  theme: 'dark' | 'light'
  avatar?: string
}

export interface Response {
  success: boolean
  data: any
}

export type MessageType = 'file' | 'media' | 'voice' | 'text'

export type ChatPopupType = 'delete' | 'clear' | 'media'

export type AttachType = 'media' | 'file'
export interface Message {
  senderId: string
  messageId: string
  type: MessageType
  reactions: Array<string>
  clearedFor: Array<string>
  createdAt: number
  isForwarded: boolean
  reply: string // message id
  content: any
  status: 'send' | 'check'
}

export interface Chat {
  id: string
  creatorId: string
  opponentId: string
  unread: number
  messages: Message[]
  deletedFor: Array<string>
  isPinned: boolean
  note?: string
  theme?: string
}
