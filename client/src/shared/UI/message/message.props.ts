import { HTMLProps, ReactNode } from 'react'

export interface MessageProps extends HTMLProps<HTMLDivElement> {
  children: ReactNode
  isOpponent: boolean
  extraClass?: string
  padding?: 'small' | 'medium' | 'large'
}
