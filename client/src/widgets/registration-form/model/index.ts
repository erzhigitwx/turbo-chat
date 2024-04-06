import { createEvent, createStore } from 'effector'

type Step = 'signup' | 'signin'

const $step = createStore<Step>('signup')

const stepChanged = createEvent<Step>()

$step.on(stepChanged, (_, curr: Step) => {
  return curr
})

export { $step, stepChanged }
