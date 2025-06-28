const Button = ({ children, ...props }) => (
    <button
        role="button"
        {...props}
        className={`${props.className || ""} px-4 py-2.5 font-semibold text-sm text-center duration-150 shadow-md rounded-lg hover:bg-gray-200 `}
    >
        {children}
    </button>
)
export default Button