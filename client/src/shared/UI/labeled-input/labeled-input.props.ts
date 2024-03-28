import { InputHTMLAttributes } from 'react'

export interface LabeledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  status?: {
    ok: boolean
    text?: string
  }
}
