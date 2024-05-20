import cl from './settings.module.scss'
import { Avatar, Button, LabeledInput } from '@/shared/UI'
import { useUnit } from 'effector-react'
import { $user } from '@/app/model'

const Settings = () => {
  const user = useUnit($user)

  return (
    <div className={cl.settings}>
      <div className={cl.settingsCol}>
        <h2>Вид профиля</h2>
        <div>
          <Avatar size={[100, 100]} />
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
      <Button isBlue>Сохранить</Button>
    </div>
  )
}

export { Settings }
