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
import { MultipleSelector } from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";

type TCustomFormMultiSelect<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  defaultValue?: PathValue<T, Path<T>>;
  description?: string;
  required?: boolean;
  options: {
    value: string;
    label: string;
  }[];
  control: Control<T>;
};

export const CustomFormMultiSelect = <T extends FieldValues> ({
  label,
  name,
  placeholder,
  description,
  options,
  control,
  defaultValue,
  required,
  className,
}: TCustomFormMultiSelect<T>) => {
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
          <FormLabel>{ label }</FormLabel>
          <FormControl>
            <MultipleSelector
              commandProps={ {
                label: label || name,
              } }
              value={ field.value }
              defaultOptions={ options }
              placeholder={ placeholder || "Select an option" }
              hidePlaceholderWhenSelected
              emptyIndicator={
                <p className="text-center text-sm">No results found</p>
              }
              onChange={ field.onChange }
            />
          </FormControl>
          { description && <FormDescription>{ description }</FormDescription> }
          <FormMessage>{ error?.message }</FormMessage>
        </FormItem>
      ) }
    />
  );
};
