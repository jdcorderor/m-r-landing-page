import React from "react";

const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input type="text" {...props} className={`w-full bg-white text-gray-700 border border-gray-300 rounded-lg outline-none p-2 ${className}`}/>
);

export default Input;
