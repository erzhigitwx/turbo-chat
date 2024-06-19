export interface UserData {
  uid: string
  login: string
  email: string
  createdAt: string
  lastLoginAt: number
  avatar?: string
  nickname?: string
  password?: string
  method: 'default' | 'google' | 'github'
  fullname?: {
    lastname?: string
    name?: string
    surname?: string
  }
}

export interface UserDataFull {
  user: UserData
  theme: 'dark' | 'light'
}

export interface Response {
  success: boolean
  data: any
}

export type MessageType = 'file' | 'media' | 'voice' | 'text'

export type ChatPopupType = 'delete' | 'clear' | 'media'

export type AttachType = {
  type: 'media' | 'file'
  data: File[] | string[]
}
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
  attach?: AttachType['data']
}

export interface Chat {
  id: string
  creatorId: string
  opponentId: string
  unread: number
  messages: Message[]
  deletedFor: Array<string>
  isPinned: boolean
  note?: {
    [key: string]: string;
  }
  theme?: string
}

export interface Status {
  [key: string]: {
    text: string
    ok: boolean
  }
}
