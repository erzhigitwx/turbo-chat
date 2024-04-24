import cl from './dropdown-menu.module.scss'
import { DropdownMenuProps } from '@/shared/UI/dropdown-menu/UI/dropdown-menu.props'
import clsx from 'clsx'

const DropdownMenu = ({ items, setItems }: DropdownMenuProps) => {
  const handleItemClick = (id: number) => {
    setItems((prev) => {
      return prev.map((item) => {
        item.isSelected = item.id === id
      })
    })
  }

  return (
    <div className={cl.dropdownMenu}>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => handleItemClick(item.id)}
          className={clsx(cl.dropdownMenuItem, item.isSelected && cl.dropdownMenuItemActive)}
        >
          <item.icon />
          <p>{item.content}</p>
        </div>
      ))}
    </div>
  )
}

export { DropdownMenu }
