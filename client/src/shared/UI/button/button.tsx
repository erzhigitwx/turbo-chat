import cl from "./button.module.scss";
import clsx from "clsx";
import { ButtonProps } from "./button.props";

const Button = ({ children, extraClass, isBlue, isGrey, ...rest }: ButtonProps) => {
  return (
    <button className={clsx(cl.button, extraClass, isBlue && cl.buttonBlue, isGrey && cl.buttonGrey)} {...rest}>
      {children}
    </button>
  );
};

export { Button };
