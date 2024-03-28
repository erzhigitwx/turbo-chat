import { createEvent, createStore } from "effector";

type stepTypes = "signup" | "signin";

const $step = createStore<stepTypes>("signup");

const stepChanged = createEvent<stepTypes>();

$step.on(stepChanged, (_, curr: stepTypes) => {
  return curr;
});

export { $step, stepChanged };
