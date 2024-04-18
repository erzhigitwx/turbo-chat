import cl from './avatar.module.scss'
import AvatarImg from '@/../public/icons/avatar.svg?react'

const Avatar = ({ isActive = false, size }: { isActive?: boolean; size?: number[] | string[] }) => {
  return isActive ? (
    <div className={cl.avatar}>
      <AvatarImg style={{ minWidth: `${size && size[0]}px`, minHeight: `${size && size[1]}px` }} />
      <div className={cl.avatarIndicator} />
    </div>
  ) : (
    <AvatarImg style={{ minWidth: `${size && size[0]}px`, minHeight: `${size && size[1]}px` }} />
  )
}

export { Avatar }
