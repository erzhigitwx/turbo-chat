import cl from './labeled-input.module.scss'
import { Input } from '@/shared/UI/input/input'
import { LabeledInputProps } from './labeled-input.props'

const LabeledInput = ({ label, status, ...rest }: LabeledInputProps) => {
  return (
    <label className={cl.labelInput}>
      <p>{label}</p>
      <Input
        {...rest}
        extraClass={(status && (status.ok ? cl.inputSuccess : cl.inputError)) || ''}
      />
      {status && (
        <p className={status.ok ? cl.labelInputSuccess : cl.labelInputError}>{status.text}</p>
      )}
    </label>
  )
}

export { LabeledInput }
