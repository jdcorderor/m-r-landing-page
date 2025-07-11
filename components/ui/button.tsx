import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

const Button = ({ children, ...props }: ButtonProps) => (
    <button
        role="button"
        {...props}
        className={`${props.className || ""} px-4 py-2.5 font-semibold text-sm text-center border-gray-300 duration-150 shadow-md hover:bg-gray-200 rounded-5 `}
    >
        {children}
    </button>
)
export default Button