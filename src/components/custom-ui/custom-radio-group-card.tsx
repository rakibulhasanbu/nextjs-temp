"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Control, FieldValues, Path } from "react-hook-form";

type TCustomRadioGroupCard<T extends FieldValues> = {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    options: {
        value: string;
        label: string;
    }[];
    columns?: number;
};

export const CustomRadioGroupCard = <T extends FieldValues> ({
    name,
    label,
    control,
    options,
    columns = 2,
}: TCustomRadioGroupCard<T>) => {
    return (
        <FormField
            control={ control }
            name={ name }
            render={ ({ field }) => (
                <FormItem className="space-y-3">
                    { label && <FormLabel>{ label }</FormLabel> }
                    <FormControl>
                        <RadioGroup
                            onValueChange={ field.onChange }
                            value={ field.value || "" }
                            className={ cn(
                                "grid gap-3",
                                columns === 1 && "grid-cols-1",
                                columns === 2 && "grid-cols-2",
                                columns === 3 && "grid-cols-3",
                                columns === 4 && "grid-cols-4"
                            ) }
                        >
                            { options.map((option) => {
                                const isSelected = field.value === option.value;
                                const radioId = `${ name }-${ option.value }`;
                                return (
                                    <FormItem key={ option.value } className="space-y-0">
                                        <FormControl>
                                            <label
                                                htmlFor={ radioId }
                                                className={ cn(
                                                    "relative flex cursor-pointer items-center gap-3 rounded-md border p-4 transition-all",
                                                    "hover:bg-accent hover:text-accent-foreground shadow-xs",
                                                    "dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
                                                    "focus-within:ring-ring focus-within:ring-2 focus-within:outline-none",
                                                    isSelected &&
                                                    "border-primary text-accent-foreground ring-primary ring-1",
                                                    "aria-invalid:border-destructive aria-invalid:ring-destructive/20"
                                                ) }
                                            >
                                                <RadioGroupItem id={ radioId } value={ option.value } />
                                                <span className="flex-1 text-sm font-medium">{ option.label }</span>
                                            </label>
                                        </FormControl>
                                    </FormItem>
                                );
                            }) }
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            ) }
        />
    );
};
