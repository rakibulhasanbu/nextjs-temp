"use client";

import * as React from "react";

import { Check, ChevronsUpDown } from "lucide-react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type TCustomFormSearchSelect<T extends FieldValues> = {
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

export const CustomFormSearchSelect = <T extends FieldValues> ({
  name,
  control,
  options,
  label,
  placeholder,
  description,
  disabled,
  required,
  showAsterisk = true,
}: TCustomFormSearchSelect<T>) => {
  const [ open, setOpen ] = React.useState(false);
  const [ searchValue, setSearchValue ] = React.useState("");

  return (
    <Controller
      name={ name }
      control={ control }
      disabled={ disabled }
      render={ ({ field, fieldState }) => (
        <Field data-invalid={ fieldState.invalid }>
          { label && <FieldLabel htmlFor={ name }>{ label } { showAsterisk ? required && <span className="text-red-500">*</span> : null }</FieldLabel> }
          <Popover open={ open } onOpenChange={ setOpen }>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={ open }
                aria-invalid={ fieldState.invalid }
                className={ cn(
                  "w-full justify-between h-auto min-h-9 text-sm bg-transparent hover:bg-transparent font-normal",
                  field.value ? "text-foreground" : "text-muted-foreground",
                  {
                    "border-destructive": fieldState.invalid,
                  }
                ) }
                disabled={ disabled }
              >
                { field.value
                  ? options.find((option) => option.value === field.value)
                    ?.label
                  : placeholder || "Select..." }
                <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-(--radix-popover-trigger-width)! p-0"
              style={ {
                left: "50%",
                minWidth: "200px",
              } }
            >
              <Command shouldFilter={ false } className="w-full rounded-sm">
                <CommandInput
                  placeholder={ `Search ${ label || "option" }...` }
                  value={ searchValue }
                  onValueChange={ setSearchValue }
                />
                <CommandList>
                  <CommandEmpty>No option found.</CommandEmpty>
                  <CommandGroup>
                    { options
                      .filter((option) =>
                        option.label
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      )
                      .map((option) => (
                        <CommandItem
                          key={ option.value }
                          value={ option.value }
                          onSelect={ (currentValue) => {
                            field.onChange(
                              currentValue === field.value ? "" : currentValue
                            );
                            setOpen(false);
                            setSearchValue("");
                          } }
                        >
                          { option.label }
                          <Check
                            className={ cn(
                              "ml-auto",
                              field.value === option.value
                                ? "opacity-100"
                                : "opacity-0"
                            ) }
                          />
                        </CommandItem>
                      )) }
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          { description && <FieldDescription>{ description }</FieldDescription> }
          { fieldState.invalid && (
            <FieldError errors={ [ fieldState.error ] } />
          ) }
        </Field>
      ) }
    />
  );
};
