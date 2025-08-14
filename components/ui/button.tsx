import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

const Button = ({ children, ...props }: ButtonProps) => (
    <button role="button" {...props} className={`${props.className || ""} text-sm text-center font-semibold duration-150 hover:bg-gray-200`}>
        {children}
    </button>
)
export default Button