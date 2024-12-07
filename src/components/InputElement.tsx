import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    leftIcon?: React.ReactNode;
    showPasswordIcon?: boolean;
};

const InputElement = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type = "text",
            leftIcon,
            showPasswordIcon,
            value,
            onChange,
            placeholder,
            name,
            id,
            "aria-label": ariaLabel,
            required,
            autoComplete,
            autoFocus,
            ...props
        },
        ref
    ) => {
        const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

        const togglePasswordVisibility = () => {
            setIsPasswordVisible((prev) => !prev);
        };

        return (
            <div className="relative w-full">
                {leftIcon && (
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        {leftIcon}
                    </div>
                )}
                <input
                    type={isPasswordVisible && type === "password" ? "text" : type}
                    className={cn(
                        "flex h-9 w-full rounded-md border border-input bg-transparent px-10 py-6 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                        leftIcon ? "pl-10" : "", // Agrega padding izquierdo si hay un ícono
                        className
                    )}
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    name={name}
                    id={id}
                    aria-label={ariaLabel}
                    required={required}
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    {...props}
                />
                {showPasswordIcon && type === "password" && (
                    <button
                        type="button"
                        className="absolute inset-y-0 end-0 flex items-center pe-3"
                        onClick={togglePasswordVisibility}
                    >
                        {isPasswordVisible ? (
                            <svg
                                className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.86-.676 1.667-1.174 2.389M4.708 4.708l14.584 14.584"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 3.057-5.065 6-9.542 6-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        )}
                    </button>
                )}
            </div>
        );
    }
);

InputElement.displayName = "Input";

export { InputElement };
