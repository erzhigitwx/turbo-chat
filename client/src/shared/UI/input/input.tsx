import cl from "./input.module.scss";
import { InputProps } from "./input.props";
import clsx from "clsx";

const Input = ({ extraClass, labelImg, ...rest }: InputProps) => {
  return labelImg ? (
    <label className={clsx(cl.inputLabel, extraClass)}>
      <div>{labelImg}</div>
      <input className={cl.input} {...rest} autoComplete={"off"} />
    </label>
  ) : (
    <input className={clsx(cl.input, extraClass)} {...rest} autoComplete={"off"} />
  );
};

export { Input };
