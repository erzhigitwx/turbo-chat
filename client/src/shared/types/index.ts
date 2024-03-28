export interface UserData {
  uid: number
  login: string
  email: string
  createdAt: string
  lastLoginAt: string
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
