export interface Status {
  [key: string]: {
    text: string
    ok: boolean
  }
}

export interface LoginStatus {
  isLoading: boolean
  error?: string
}
