import clsx from "clsx";
import type React from "react";

interface DuolingoButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "disabled";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export default function DuolingoButton({
  children,
  className,
  variant = "primary",
  size = "md",
  disabled,
  fullWidth = false,
  ...props
}: DuolingoButtonProps) {
  // Fixed heights for each size to prevent layout shifts
  const heightStyles = {
    sm: "h-[34px]", // Includes space for the border
    md: "h-[46px]", // Includes space for the border
    lg: "h-[62px]", // Includes space for the border
  };

  // Content padding
  const paddingStyles = {
    sm: "py-1 px-3",
    md: "py-2 px-4",
    lg: "py-3 px-6",
  };

  // Font sizes
  const fontStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  // Variant styles (colors)
  const variantStyles = {
    primary:
      "bg-[#FFD700] text-[#3A2E02] border-b-4 border-[#D4AF37] hover:bg-[#FFDF33]",
    secondary:
      "bg-[#FFFFFF] text-[#D4AF37] border-2 border-b-4 border-[#D4AF37] hover:bg-[#FFF8E1]",
    disabled:
      "bg-[#E5E5E5] text-[#AFAFAF] border-b-4 border-[#CCCCCC] cursor-not-allowed",
  };

  const heightStyle = heightStyles[size];
  const paddingStyle = paddingStyles[size];
  const fontStyle = fontStyles[size];
  const variantStyle = disabled
    ? variantStyles.disabled
    : variantStyles[variant];

  return (
    <div
      className={clsx(
        "inline-flex relative",
        heightStyle,
        "hover:cursor-pointer",
        fullWidth ? "w-full" : "w-auto",
        className
      )}
    >
      <button
        className={clsx(
          "hover:cursor-pointer",
          "rounded-xl w-full font-bold transition-all duration-75",
          variantStyle,
          fontStyle,
          paddingStyle,
          // When active, move content down but keep total height the same
          "active:translate-y-[2px] active:border-b-2"
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
