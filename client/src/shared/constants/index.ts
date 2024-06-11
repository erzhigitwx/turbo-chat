import { string } from 'yup'

const emailValidation = string().required('Email is required').email('Must be the correct email')
const loginValidation = string()
  .trim()
  .matches(
    /^[A-Za-z0-9\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]*$/gi,
    'Login can only contain Latin letters.',
  )
  .min(3)
  .max(16)
  .required('Login is required')
const passwordValidation = string()
  .trim()
  .transform((value) => (value === '' ? undefined : value))
  .required('Password is required')
  .matches(
    /^[A-Za-z0-9\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]*$/gi,
    'Password can only contain Latin letters.',
  )
  .matches(/^(?=.*[0-9])/, 'Password must contain at least one digit')
  .matches(/^(?=.*[a-zA-Z])/, 'Password must contain at least one letter')
  .min(6, 'Password must be at least 6 characters long')
  .max(16, 'Password must be less than 16 characters long')
const nameValidation = function (name: string) {
  return string()
    .trim()
    .nullable()
    .matches(
      /^[A-Za-z0-9\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]*$/gi,
      `${name} can only contain Latin letters.`,
    )
    .transform((curr, orig) => (orig === '' ? null : curr))
    .min(2, `${name} must be at least 2 characters`)
    .max(16, `${name} must be less than 16 characters`)
}

export { emailValidation, loginValidation, passwordValidation, nameValidation }
