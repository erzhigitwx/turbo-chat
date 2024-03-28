import cl from './registration-form.module.scss'
import { useState } from 'react'
import { useUnit } from 'effector-react'
import clsx from 'clsx'
import { Button, LabeledInput, TextDivider } from '@/shared/UI'
import { $step, stepChanged } from './model'
import { googleSignIn } from '@/features/auth/google-signin'
import GoogleIcon from '@/../public/logos/google.svg?react'
import GithubIcon from '@/../public/logos/github.svg?react'
import { githubSignIn } from '@/features/auth/github-signin'
import { handleFormSubmit } from '@/features/auth/email-signin'
import { HiddenLabeledInput } from '@/shared/UI/hidden-labeled-input/hidden-labeled-input'
import { Status } from '@/widgets/registration-form/registration-form.props'
import { Fetch } from '@/shared/utils/methods'

const RegistrationForm = () => {
  const [status, setStatus] = useState<Status | null>(null)
  const step = useUnit($step)
  const isSignup = step === 'signup'

  return (
    <div className={cl.registrationFormWrapper}>
      <form className={cl.registrationForm} onSubmit={(e) => handleFormSubmit(e, setStatus)}>
        <h1>Добро пожаловать!</h1>
        <h6>Зарегистрируйтесь или введите данные от аккаунта 🙂</h6>
        <div className={cl.registrationFormSwitch}>
          <div
            className={clsx(step === 'signup' && cl.registrationFormSwitchActive)}
            onClick={() => stepChanged('signup')}
          >
            <p>Регистрация</p>
          </div>
          <div
            className={clsx(step === 'signin' && cl.registrationFormSwitchActive)}
            onClick={() => stepChanged('signin')}
          >
            <p>Вход</p>
          </div>
        </div>
        {isSignup ? (
          <>
            <LabeledInput
              label={'Логин'}
              name={'login'}
              placeholder={'Erzhik'}
              status={status ? status.login : undefined}
            />
            <LabeledInput
              label={'Электронная почта'}
              name={'email'}
              placeholder={'erzhik@gmail.com'}
              status={status ? status.email : undefined}
            />
            <HiddenLabeledInput
              label={'Пароль'}
              name={'password'}
              placeholder={'123'}
              type={'password'}
              status={status ? status.password : undefined}
            />
          </>
        ) : (
          <>
            <LabeledInput
              label={'Электронная почта'}
              name={'email'}
              type={'email'}
              placeholder={'erzhik@gmail.com'}
            />
            <HiddenLabeledInput
              label={'Пароль'}
              name={'password'}
              placeholder={'123'}
              type={'password'}
            />
          </>
        )}
        <Button isBlue extraClass={cl.registrationFormButton}>
          {isSignup ? 'Зарегистрироваться' : 'Войти'}
        </Button>
        <TextDivider text={'Или зарегистрироваться через'}></TextDivider>
        <div className={cl.registrationFormProviders}>
          <Button onClick={googleSignIn} type={'button'}>
            <GoogleIcon />
            <h6>с помощью Google</h6>
          </Button>
          <Button onClick={githubSignIn} type={'button'}>
            <GithubIcon />
            <h6>с помощью Google</h6>
          </Button>
        </div>
      </form>
    </div>
  )
}

export { RegistrationForm }
