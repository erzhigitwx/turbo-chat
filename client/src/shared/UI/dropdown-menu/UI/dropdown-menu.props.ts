import { Dispatch, FunctionComponent, SetStateAction, SVGProps } from 'react'

export interface DropdownMenuProps {
  items: DropdownMenuItem[]
  setItems: Dispatch<SetStateAction<DropdownMenuItem[]>>
}

export interface DropdownMenuItem {
  id: number
  content: string
  onClick: any
  isSelected: boolean
  icon: FunctionComponent<SVGProps<SVGSVGElement>>
}
