import cl from './text-area.module.scss'
import { TextAreaProps } from '@/shared/UI/text-area/text-area.props'
import clsx from 'clsx'

const TextArea = ({ extraClass, ...rest }: TextAreaProps) => {
  return <textarea className={clsx(cl.textarea, extraClass, 'scroll')} {...rest}></textarea>
}

export { TextArea }
