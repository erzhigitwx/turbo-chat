import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  extraClass?: string;
  isBlue?: boolean;
  isGrey?: boolean;
}
