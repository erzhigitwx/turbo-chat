import cl from './dropdown-menu.module.scss'
import { DropdownMenuProps } from '@/shared/UI/dropdown-menu/UI/dropdown-menu.props'

const DropdownMenu = ({ items }: DropdownMenuProps) => {
  return (
    <div className={cl.dropdownMenu}>
      {items.map((item) => (
        <div key={item.id} onClick={() => item.onClick()} className={cl.dropdownMenuItem}>
          <item.icon />
          <p>{item.content}</p>
        </div>
      ))}
    </div>
  )
}

export { DropdownMenu }
