import cl from './HiddenLabaledInput.module.scss'
import { Button, LabeledInput } from '@/shared/UI'
import { HiddenLabeledInputProps } from './hidden-labeled-input.props'
import { useState } from 'react'
import Eye from '@/assets/icons/eye.svg?react'
import EyeClose from '@/assets/icons/eye-close.svg?react'
import clsx from 'clsx'

const HiddenLabeledInput = ({ label, status, ...rest }: HiddenLabeledInputProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={clsx(cl.hiddenLabaledInput, status?.text && cl.hiddenLabaledInputStatus)}
      {...rest}
    >
      <LabeledInput
        label={label}
        name={'password'}
        type={isOpen ? 'text' : 'password'}
        status={status}
      />
      <Button onClick={() => setIsOpen((prev) => !prev)} type={'button'}>
        {isOpen ? (
          <Eye className={'blue-stroke-hover'} />
        ) : (
          <EyeClose className={'blue-stroke-hover'} />
        )}
      </Button>
    </div>
  )
}

export { HiddenLabeledInput }
