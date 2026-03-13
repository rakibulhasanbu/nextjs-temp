import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

type CustomInputProps = {
    label?: string;
    placeholder: string;
    description?: string;
    disabled?: boolean;
    type?: "email" | "password" | "text" | "number" | "url" | "tel";
    value: string | number;
    onChange: (value: string | number) => void;
    required?: boolean;
    min?: number;
    className?: string;
    error?: string;
    invalid?: boolean;
};

export const CustomInput = ({
    label,
    disabled,
    placeholder,
    type = "text",
    description,
    value,
    onChange,
    required,
    min,
    className = "",
    error,
    invalid,
}: CustomInputProps) => {
    const [show, setShow] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = type === "number" ? Number(e.target.value) : e.target.value;
        onChange(newValue);
    };

    return (
        <div className={`w-full space-y-1 ${className}`}>
            {label && (
                <Label htmlFor={label} className="gap-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </Label>
            )}
            <div className="relative">
                <Input
                    id={label}
                    placeholder={placeholder}
                    type={type === "password" ? (show ? "text" : "password") : type}
                    value={type === "number" ? (value ? Number(value) : "") : value}
                    onChange={handleChange}
                    disabled={disabled}
                    min={min}
                    required={required}
                    aria-invalid={invalid}
                />
                {type === "password" &&
                    (show ? (
                        <Eye
                            onClick={() => setShow((prev) => !prev)}
                            className="absolute top-[30%] right-4 cursor-pointer"
                            size={16}
                        />
                    ) : (
                        <EyeOff
                            onClick={() => setShow((prev) => !prev)}
                            className="absolute top-[30%] right-4 cursor-pointer"
                            size={16}
                        />
                    ))}
            </div>
            {description && <div className="text-muted-foreground text-[0.8rem]">{description}</div>}
            {error && <div className="text-destructive text-sm font-medium">{error}</div>}
        </div>
    );
};
