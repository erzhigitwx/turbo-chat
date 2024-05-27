import { string } from 'yup'

const emailValidation = string().required('Email is required').email('Must be the correct email')
const loginValidation = string().trim().min(3).max(16).required('Login is required')
const passwordValidation = string()
  .trim()
  .transform((value) => (value === '' ? undefined : value))
  .required('Password is required')
  .matches(/^(?=.*[0-9])/, 'Password must contain at least one digit')
  .matches(/^(?=.*[a-zA-Z])/, 'Password must contain at least one letter')
  .min(6, 'Password must be at least 6 characters long')
  .max(16, 'Password must be less than 16 characters long')
const nameValidation = function (name: string) {
  return string()
    .trim()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .min(2, `${name} must be at least 2 characters`)
    .max(16, `${name} must be less than 16 characters`)
}

export { emailValidation, loginValidation, passwordValidation, nameValidation }
