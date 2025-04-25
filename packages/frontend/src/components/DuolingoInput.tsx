import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";

interface DuolingoInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  tailwindSize?: "sm" | "md" | "lg";
}
export default function DuolingoInput({
  className,
  label,
  error,
  ref,
  fullWidth = false,
  tailwindSize = "md",
  btnDir = "rtl",
  containerDir = "rtl",
  disabled,
  ...props
}: React.PropsWithChildren<DuolingoInputProps> & {
  className: string;
  disabled: boolean;
  containerDir: "rtl" | "ltr";
  btnDir: "rtl" | "ltr";
  ref: React.RefObject<HTMLInputElement | null>;
}) {
  // Size variations
  const sizeStyles = {
    sm: "h-8 text-sm px-3 py-1",
    md: "h-10 text-base px-4 py-2",
    lg: "h-12 text-lg px-5 py-2.5",
  };

  const sizeStyle = sizeStyles[tailwindSize];

  return (
    <div
      dir={containerDir}
      className={clsx("flex flex-col gap-1.5", fullWidth ? "w-full" : "w-auto")}
    >
      {label && (
        <label className="font-medium text-gray-800 text-sm">{label}</label>
      )}

      <input
        ref={ref}
        dir={btnDir}
        className={clsx(
          "rounded-md w-full transition-colors duration-200",
          sizeStyle,
          "border border-gray-300",
          "text-gray-900 placeholder:text-gray-500",
          "outline-none",
          "focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]",
          disabled && "bg-gray-100 text-gray-400 cursor-not-allowed",
          error &&
            !disabled &&
            "border-red-500 focus:border-red-500 focus:ring-red-200",
          className
        )}
        disabled={disabled}
        {...props}
      />

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ y: -5 }}
            animate={{ y: 0 }}
            exit={{ y: -5 }}
            className="text-red-500 text-sm"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
