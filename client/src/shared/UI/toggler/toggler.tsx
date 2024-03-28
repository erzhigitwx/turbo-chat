import cl from "./toggler.module.scss";
import clsx from "clsx";
import SunImg from "@/../public/icons/sun.svg?react";
import MoonImg from "@/../public/icons/moon.svg?react";

interface TogglerProps {
  value: boolean;
  setter: () => void;
  isThemeToggler?: boolean;
  size?: number[];
}

const Toggler = ({ value, setter, isThemeToggler = false, size = [24, 24] }: TogglerProps) => {
  return (
    <div onClick={setter} className={cl.theme__select}>
      {isThemeToggler ? (
        <>
          <div onClick={setter} className={clsx(!value && cl.theme__select__item)} style={{ width: size[0], height: size[1] }}>
            <SunImg />
          </div>
          <div onClick={setter} className={clsx(value && cl.theme__select__item)} style={{ width: size[0], height: size[1] }}>
            <MoonImg />
          </div>
        </>
      ) : (
        <>
          <div onClick={setter} className={`${!value && cl.theme__select__item}`} style={{ width: size[0], height: size[1] }} />
          <div onClick={setter} className={`${value && cl.theme__select__item}`} style={{ width: size[0], height: size[1] }} />
        </>
      )}
    </div>
  );
};

export { Toggler };
