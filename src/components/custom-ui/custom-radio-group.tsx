"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type TCustomRadioGroup<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    options: {
        value: string;
        label: string;
    }[];
    defaultValue?: string;
    label?: string;
    description?: string;
    disabled?: boolean;
    required?: boolean;
    showAsterisk?: boolean;
    orientation?: "horizontal" | "vertical";
};

export const CustomRadioGroup = <T extends FieldValues> ({
    name,
    control,
    options,
    defaultValue,
    label,
    description,
    disabled,
    required,
    showAsterisk = true,
    orientation = "vertical",
}: TCustomRadioGroup<T>) => {
    return (
        <Controller
            name={ name }
            control={ control }
            disabled={ disabled }
            render={ ({ field, fieldState }) => (
                <Field data-invalid={ fieldState.invalid }>
                    { label && <FieldLabel htmlFor={ name }>{ label } { showAsterisk ? required && <span className="text-red-500">*</span> : null }</FieldLabel> }
                    <RadioGroup
                        onValueChange={ field.onChange }
                        defaultValue={ defaultValue || "" }
                        disabled={ disabled }
                        className={ cn("flex flex-col gap-3", orientation === "horizontal" && "flex-row gap-4") }
                    >
                        { options.map((option) => (
                            <div key={ option.value } className="flex items-center gap-2">
                                <RadioGroupItem value={ option.value } id={ `${ name }-${ option.value }` } />
                                <Label htmlFor={ `${ name }-${ option.value }` } className="cursor-pointer font-normal">
                                    { option.label }
                                </Label>
                            </div>
                        )) }
                    </RadioGroup>
                    { description && <FieldDescription>{ description }</FieldDescription> }
                    { fieldState.invalid && (
                        <FieldError errors={ [ fieldState.error ] } />
                    ) }
                </Field>
            ) }
        />
    );
};
