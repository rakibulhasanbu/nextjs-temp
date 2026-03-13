"use client";

import { Control, FieldValues, Path, PathValue } from "react-hook-form";

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type TCustomFormSelect<T extends FieldValues> = {
    name: Path<T>;
    label?: string;
    placeholder?: string;
    className?: string;
    defaultValue?: PathValue<T, Path<T>>;
    description?: string;
    disabled?: boolean;
    required?: boolean;
    options: {
        value: string;
        label: string;
    }[];
    control: Control<T>;
};

export const CustomFormSelect = <T extends FieldValues> ({
    label,
    name,
    placeholder,
    description,
    options,
    control,
    defaultValue,
    disabled,
    required,
    className,
}: TCustomFormSelect<T>) => {
    return (
        <FormField
            control={ control }
            name={ name }
            rules={ {
                required: required ? `${ label || name } is required` : false,
            } }
            defaultValue={ defaultValue }
            render={ ({ field, fieldState: { error } }) => (
                <FormItem className={ cn("w-full h-fit", className) }>
                    <FormLabel>
                        { label }{ " " }
                        { required && <span className="text-red-500">*</span> }
                    </FormLabel>
                    <FormControl>
                        <Select
                            disabled={ disabled }
                            onValueChange={ field.onChange }
                            defaultValue={ field.value }
                            value={ field.value }
                        >
                            <SelectTrigger
                                className={ cn("w-full", {
                                    "border-destructive": error,
                                }) }
                            >
                                <SelectValue
                                    placeholder={
                                        placeholder || "Select an option"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent className="w-full min-w-32">
                                { options.map((option) => (
                                    <SelectItem
                                        key={ option.value }
                                        value={ option.value }
                                    >
                                        { option.label }
                                    </SelectItem>
                                )) }
                            </SelectContent>
                        </Select>
                    </FormControl>
                    { description && (
                        <FormDescription>{ description }</FormDescription>
                    ) }
                    <FormMessage>{ error?.message }</FormMessage>
                </FormItem>
            ) }
        />
    );
};
