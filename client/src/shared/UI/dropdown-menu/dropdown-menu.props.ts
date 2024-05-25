import { FunctionComponent, SVGProps } from 'react'

export interface DropdownMenuProps {
  items: DropdownMenuItem[]
}

export interface DropdownMenuItem {
  id: number
  content: string
  onClick: any
  icon: FunctionComponent<SVGProps<SVGSVGElement>>
}
