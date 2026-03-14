"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";

import { cn } from "@/lib/utils";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldLabel,
    FieldLegend,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type TCustomRadioGroupCard<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    options: {
        value: string;
        label: string;
        description?: string;
    }[];
    label?: string;
    description?: string;
    disabled?: boolean;
    required?: boolean;
    showAsterisk?: boolean;
    columns?: number;
};

export const CustomRadioGroupCard = <T extends FieldValues> ({
    name,
    control,
    options,
    label,
    description,
    disabled,
    required,
    showAsterisk = true,
    columns,
}: TCustomRadioGroupCard<T>) => {
    return (
        <Controller
            name={ name }
            control={ control }
            disabled={ disabled }
            render={ ({ field, fieldState }) => (
                <FieldSet data-invalid={ fieldState.invalid }>
                    { label && (
                        <FieldLegend>
                            { label } { showAsterisk ? required && <span className="text-red-500">*</span> : null }
                        </FieldLegend>
                    ) }
                    { description && <FieldDescription>{ description }</FieldDescription> }
                    <RadioGroup
                        name={ field.name }
                        value={ field.value || "" }
                        onValueChange={ field.onChange }
                        disabled={ disabled }
                        aria-invalid={ fieldState.invalid }
                        className={ cn(
                            "grid gap-3",
                            columns === 1 && "grid-cols-1",
                            columns === 2 && "grid-cols-2",
                            columns === 3 && "grid-cols-3",
                            columns === 4 && "grid-cols-4"
                        ) }
                    >
                        { options.map((option) => (
                            <FieldLabel
                                key={ option.value }
                                htmlFor={ `${ name }-${ option.value }` }
                            >
                                <Field
                                    orientation="horizontal"
                                    data-invalid={ fieldState.invalid }
                                >
                                    <FieldContent>
                                        <FieldTitle>{ option.label }</FieldTitle>
                                        { option.description && (
                                            <FieldDescription>
                                                { option.description }
                                            </FieldDescription>
                                        ) }
                                    </FieldContent>
                                    <RadioGroupItem
                                        value={ option.value }
                                        id={ `${ name }-${ option.value }` }
                                        aria-invalid={ fieldState.invalid }
                                    />
                                </Field>
                            </FieldLabel>
                        )) }
                    </RadioGroup>
                    { fieldState.invalid && (
                        <FieldError errors={ [ fieldState.error ] } />
                    ) }
                </FieldSet>
            ) }
        />
    );
};
