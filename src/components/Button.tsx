import React from "react";

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  status?: "info" | "danger" | "gray" | "success";
  className?: string;
  disabled?: boolean;
}

const Button = ({
  children,
  onClick,
  status = "info",
  className,
  disabled = false,
}: ButtonProps) => {
  const getButtonStyle = () => {
    if (status === "danger") {
      return "bg-red-500 hover:bg-white hover:text-red-500 border-red-500";
    }
    if (status === "gray") {
      return "bg-gray-500 hover:bg-white hover:text-gray-500 border-gray-500";
    }
    if (status === "success") {
      return "bg-green-500 hover:bg-white hover:text-green-500 border-green-500";
    }
    return "bg-primary hover:bg-white hover:text-primary border-primary";
  };

  return (
    <button
      className={`px-4 py-1 w-fit h-fit rounded-md text-white text-sm font-bold transition duration-200 border-2 ${getButtonStyle()} ${className}`}
      onClick={onClick}
      type="submit"
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
