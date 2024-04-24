import { Dispatch, ReactNode, SetStateAction } from 'react'

export interface DropdownMenuProps {
  items: DropdownMenuItem[]
  setItems: Dispatch<SetStateAction<DropdownMenuItem[]>>
}

export interface DropdownMenuItem {
  id: number
  content: string
  icon: ReactNode
  isSelected: boolean
}
