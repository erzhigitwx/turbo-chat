import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import cl from './settings.module.scss'
import { handleSave } from '@/widgets/settings/utils'
import { SettingsAvatar } from '@/entities'
import { Button, LabeledInput } from '@/shared/UI'
import { deleteCookie } from '@/shared/utils'
import { Status } from '@/shared/types'
import { useUserData } from '@/shared/hooks/use-user-data'

const Settings = () => {
  const user = useUserData()
  const [status, setStatus] = useState<Status | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const refAvatar = useRef<HTMLInputElement | null>(null)

  const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const maxSize = 3 * 1024 * 1024 // 3MB

    if (file && file.size > maxSize) {
      setError('The file size is too large. Select a file less than 3 MB in size.')
      return
    }

    if (file) {
      const url = URL.createObjectURL(file)
      setError(null)
      setImageUrl(url)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    if (!error) {
      setIsSaving(true)
      await handleSave(e, setStatus)
      setIsSaving(false)
    }
  }

  const handleTriggerInput = () => {
    if (refAvatar.current) {
      refAvatar.current?.click()
    }
  }

  return (
    <form className={cl.settings} onSubmit={handleSubmit}>
      <div className={cl.settingsCol}>
        <h2>Вид профиля</h2>
        <input
          name={'avatar'}
          type={'file'}
          ref={refAvatar}
          onChange={handleSelectImage}
          accept="image/png, image/jpeg, image/gif"
          hidden
        />
      </div>
      <SettingsAvatar imageUrl={imageUrl} error={error} handleTriggerInput={handleTriggerInput} />
      <div className={cl.settingsCol}>
        <h2>Основная информация</h2>
        <div className={cl.settingsRow}>
          <LabeledInput
            name={'lastname'}
            label={'Фамилия'}
            status={status?.lastname}
            defaultValue={user?.fullname?.lastname}
          />
          <LabeledInput
            name={'name'}
            label={'Имя'}
            status={status?.name}
            defaultValue={user?.fullname?.name}
          />
          <LabeledInput
            name={'surname'}
            label={'Отчество'}
            status={status?.surname}
            defaultValue={user?.fullname?.surname}
          />
        </div>
      </div>
      <div className={cl.settingsRow}>
        <LabeledInput
          name={'login'}
          label={'Логин'}
          status={status?.login}
          defaultValue={user?.login}
        />
        <LabeledInput label={'Почта'} value={user?.email} />
        <LabeledInput label={'URL'} value={'turbo-chat/' + user?.login} />
      </div>
      <div className={cl.settingsButtons}>
        <Button isBlue>{isSaving ? 'Сохраняем...' : 'Сохранить'}</Button>
        <Button
          type={'button'}
          onClick={() => {
            deleteCookie('token')
            window.location.reload()
          }}
        >
          Выйти
        </Button>
      </div>
    </form>
  )
}

export { Settings }
