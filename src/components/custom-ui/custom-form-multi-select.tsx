"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { MultipleSelector } from "@/components/ui/multi-select";

type TCustomFormMultiSelect<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  options: {
    value: string;
    label: string;
  }[];
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  showAsterisk?: boolean;
};

export const CustomFormMultiSelect = <T extends FieldValues> ({
  name,
  control,
  options,
  label,
  placeholder,
  description,
  disabled,
  required,
  showAsterisk = true,
}: TCustomFormMultiSelect<T>) => {
  return (
    <Controller
      name={ name }
      control={ control }
      disabled={ disabled }
      render={ ({ field, fieldState }) => (
        <Field data-invalid={ fieldState.invalid }>
          { label && <FieldLabel htmlFor={ name }>{ label } { showAsterisk ? required && <span className="text-red-500">*</span> : null }</FieldLabel> }
          <MultipleSelector
            commandProps={ {
              label: label || name,
            } }
            value={ field.value }
            defaultOptions={ options }
            placeholder={ placeholder || "Select..." }
            hidePlaceholderWhenSelected
            emptyIndicator={
              <p className="text-center text-sm">No results found</p>
            }
            onChange={ field.onChange }
          />
          { description && <FieldDescription>{ description }</FieldDescription> }
          { fieldState.invalid && (
            <FieldError errors={ [ fieldState.error ] } />
          ) }
        </Field>
      ) }
    />
  );
};
