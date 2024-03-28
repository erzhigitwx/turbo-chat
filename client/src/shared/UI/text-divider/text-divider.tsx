import cl from "./text-divider.module.scss";
import { TextDividerProps } from "./text-divider.props";

const TextDivider = ({ text, ...rest }: TextDividerProps) => {
  return (
    <div {...rest} className={cl.divider}>
      <hr className={cl.line} />
      <p>{text}</p>
      <hr className={cl.line} />
    </div>
  );
};

export { TextDivider };
