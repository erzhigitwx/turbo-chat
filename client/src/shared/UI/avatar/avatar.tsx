import cl from './avatar.module.scss'
import AvatarImg from '@/assets/icons/avatar.svg?react'

const Avatar = ({
  isActive = false,
  size = [40, 40],
  src,
}: {
  isActive?: boolean
  size?: number[] | string[]
  src?: string
}) => {
  return isActive ? (
    <div className={cl.avatar}>
      {src ? (
        <img
          src={src}
          alt={'avatar'}
          className={cl.avatarCustom}
          style={{ width: `${size && size[0]}px`, height: `${size && size[1]}px` }}
        />
      ) : (
        <AvatarImg
          style={{ minWidth: `${size && size[0]}px`, minHeight: `${size && size[1]}px` }}
        />
      )}
      <div className={cl.avatarIndicator} />
    </div>
  ) : (
    <>
      {src ? (
        <img
          src={src}
          alt={'avatar'}
          className={cl.avatarCustom}
          style={{ width: `${size && size[0]}px`, height: `${size && size[1]}px` }}
        />
      ) : (
        <AvatarImg
          style={{ minWidth: `${size && size[0]}px`, minHeight: `${size && size[1]}px` }}
        />
      )}
    </>
  )
}

export { Avatar }
