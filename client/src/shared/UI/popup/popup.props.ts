import { HTMLAttributes, ReactNode } from 'react'

export interface PopupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  withShadow?: boolean
  isCentered?: boolean
  extraClass?: string
}
