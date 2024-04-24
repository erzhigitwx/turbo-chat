import { ReactNode } from 'react'

export interface PopupProps {
  children: ReactNode
  withShadow?: boolean
  isCentered?: boolean
  extraClass?: string
}
