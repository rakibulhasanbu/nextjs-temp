"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";

type TCustomFormCheckbox<T extends FieldValues> = {
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
};

export const CustomFormCheckbox = <T extends FieldValues> ({
    name,
    control,
    options,
    label,
    description,
    disabled,
    required,
    showAsterisk = true,
}: TCustomFormCheckbox<T>) => {
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
                    <FieldGroup data-slot="checkbox-group">
                        { options.map((option) => (
                            <Field
                                key={ option.value }
                                orientation="horizontal"
                                data-invalid={ fieldState.invalid }
                            >
                                <Checkbox
                                    id={ `${ name }-${ option.value }` }
                                    name={ field.name }
                                    aria-invalid={ fieldState.invalid }
                                    checked={ field.value?.includes(option.value) }
                                    disabled={ disabled }
                                    onCheckedChange={ (checked) => {
                                        const currentValue = field.value || [];
                                        const newValue = checked
                                            ? [ ...currentValue, option.value ]
                                            : currentValue.filter(
                                                (value: string) => value !== option.value
                                            );
                                        field.onChange(newValue);
                                        field.onBlur();
                                    } }
                                />
                                <FieldContent>
                                    <FieldLabel htmlFor={ `${ name }-${ option.value }` }>
                                        { option.label }
                                    </FieldLabel>
                                    { option.description && (
                                        <FieldDescription>
                                            { option.description }
                                        </FieldDescription>
                                    ) }
                                </FieldContent>
                            </Field>
                        )) }
                    </FieldGroup>
                    { fieldState.invalid && (
                        <FieldError errors={ [ fieldState.error ] } />
                    ) }
                </FieldSet>
            ) }
        />
    );
};
