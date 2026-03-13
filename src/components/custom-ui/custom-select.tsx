import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type CustomSelectProps = {
    label?: string;
    placeholder?: string;
    description?: string;
    disabled?: boolean;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    className?: string;
    triggerClassName?: string;
    error?: string;
    options: {
        value: string;
        label: string;
    }[];
};

export const CustomSelect = ({
    label,
    disabled,
    placeholder,
    description,
    value,
    onChange,
    required,
    className = "",
    error,
    options,
    triggerClassName,
}: CustomSelectProps) => {
    return (
        <div className={`w-full space-y-0.5 ${className}`}>
            {label && <div className="text-sm font-medium">{label}</div>}
            <div className="relative">
                <Select
                    disabled={disabled}
                    onValueChange={onChange}
                    value={value}
                    required={required}
                >
                    <SelectTrigger
                        className={cn(
                            "w-full",
                            {
                                "border-destructive": error,
                            },
                            triggerClassName
                        )}
                    >
                        <SelectValue
                            placeholder={placeholder || "Select an option"}
                        />
                    </SelectTrigger>
                    <SelectContent className="w-full max-h-[320px] overflow-y-auto min-w-32">
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {description && (
                <div className="text-[0.8rem] text-muted-foreground">
                    {description}
                </div>
            )}
            {error && (
                <div className="text-sm font-medium text-destructive">
                    {error}
                </div>
            )}
        </div>
    );
};
