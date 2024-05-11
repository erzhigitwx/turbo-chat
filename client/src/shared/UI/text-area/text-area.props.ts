import { TextareaHTMLAttributes } from 'react'

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  extraClass?: string
}
