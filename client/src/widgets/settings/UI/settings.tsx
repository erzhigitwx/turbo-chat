import cl from './settings.module.scss'
import { Avatar, Button, LabeledInput } from '@/shared/UI'
import { useUnit } from 'effector-react'
import { $user } from '@/app/model'
import { deleteCookie } from '@/shared/utils'
import ChangeImg from '@/assets/icons/change.svg?react'

const Settings = () => {
  const user = useUnit($user)

  return (
    <div className={cl.settings}>
      <div className={cl.settingsCol}>
        <h2>Вид профиля</h2>
        <div>
          {user?.avatar ? (
            <div className={cl.settingsAvatar}>
              <img src={user.avatar} alt={'avatar'} className={cl.settingsAvatarCustom} />
              <Button>
                <ChangeImg className={'blue-stroke'} />
              </Button>
            </div>
          ) : (
            <div className={cl.settingsAvatar}>
              <Avatar size={[150, 150]} />
              <Button>
                <ChangeImg className={'blue-stroke'} />
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className={cl.settingsCol}>
        <h2>Основная информация</h2>
        <div className={cl.settingsRow}>
          <LabeledInput label={'Фамилия'} />
          <LabeledInput label={'Имя'} />
          <LabeledInput label={'Отчество'} />
        </div>
      </div>
      <div className={cl.settingsRow}>
        <LabeledInput label={'Логин'} value={user?.login} />
        <LabeledInput label={'Почта'} value={user?.email} />
        <LabeledInput label={'URL'} value={'turbo-chat/' + user?.login} />
      </div>
      <div className={cl.settingsButtons}>
        <Button isBlue>Сохранить</Button>
        <Button
          onClick={() => {
            deleteCookie('token')
            window.location.reload()
          }}
        >
          Выйти
        </Button>
      </div>
    </div>
  )
}

export { Settings }
