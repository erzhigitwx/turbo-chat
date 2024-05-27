import cl from '@/widgets/settings/UI/settings.module.scss'
import { Avatar, Button } from '@/shared/UI'
import { useUnit } from 'effector-react'
import { $user } from '@/app/model'
import ChangeImg from '@/assets/icons/change.svg?react'
import { SettingsAvatarProps } from './settings-avatar.props'

const SettingsAvatar = ({ imageUrl, handleTriggerInput, error }: SettingsAvatarProps) => {
  const user = useUnit($user)

  return (
    <div>
      {user?.avatar ? (
        <div className={cl.settingsAvatar}>
          <img src={imageUrl || user.avatar} alt="avatar" className={cl.settingsAvatarCustom} />
          <Button onClick={handleTriggerInput} type={'button'}>
            <ChangeImg className={'blue-stroke'} />
          </Button>
        </div>
      ) : (
        <div className={cl.settingsAvatar}>
          {imageUrl ? (
            <img src={imageUrl} alt="avatar" className={cl.settingsAvatarCustom} />
          ) : (
            <Avatar size={[150, 150]} />
          )}
          <Button onClick={handleTriggerInput} type={'button'}>
            <ChangeImg className={'blue-stroke'} />
          </Button>
        </div>
      )}
      {error && (
        <div className={cl.settingsError}>
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}

export { SettingsAvatar }
