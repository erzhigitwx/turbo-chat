import { InputHTMLAttributes, ReactElement, SVGProps } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  extraClass?: string;
  labelImg?: ReactElement<SVGProps<SVGSVGElement>>;
}
