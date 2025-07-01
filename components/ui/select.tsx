const Select = ({ ...props }) => (
    <select
        {...props}
        className={`w-full px-3 py-2 text-gray-500 outline-none border shadow-sm rounded-lg duration-150 ${props.className || ""}`}
    />
)

export default Select