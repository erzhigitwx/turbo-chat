import { Dispatch, SetStateAction, useContext } from "react";
import { Theme } from "@/shared/types/theme";
import { ThemeContext } from "@/app/providers/theme-provider";

interface UseThemeProps {
  theme: Theme | null;
  setTheme: Dispatch<SetStateAction<Theme>> | undefined;
}

export const useTheme = () => {
  const context: UseThemeProps | null = useContext(ThemeContext);

  return {
    theme: context?.theme,
    setTheme: context?.setTheme,
  };
};
