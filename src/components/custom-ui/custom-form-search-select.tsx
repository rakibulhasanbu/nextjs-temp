"use client";

import * as React from "react";

import { Check, ChevronsUpDown } from "lucide-react";
import { Control, FieldValues, Path, PathValue } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type TCustomFormSearchSelect<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  options: {
    value: string;
    label: string;
  }[];
  control: Control<T>;
};

export const CustomFormSearchSelect = <T extends FieldValues> ({
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
}: TCustomFormSearchSelect<T>) => {
  const [ open, setOpen ] = React.useState(false);
  const [ searchValue, setSearchValue ] = React.useState("");

  return (
    <FormField
      control={ control }
      name={ name }
      rules={ {
        required: required ? `${ label || name } is required` : false,
      } }
      defaultValue={ defaultValue as PathValue<T, Path<T>> }
      render={ ({ field, fieldState: { error } }) => (
        <FormItem className={ cn("flex h-fit flex-col", className) }>
          { label && (
            <FormLabel>
              { label } { required && <span className="text-red-500">*</span> }
            </FormLabel>
          ) }
          <FormControl>
            <Popover open={ open } onOpenChange={ setOpen }>
              <PopoverTrigger asChild>
                <Button
                  variant="secondary"
                  role="combobox"
                  aria-expanded={ open }
                  className={ cn(
                    "w-full justify-between border shadow-none text-sm bg-transparent",
                    {
                      "border-destructive": error,
                    }
                  ) }
                  disabled={ disabled }
                >
                  { field.value
                    ? options.find((option) => option.value === field.value)
                      ?.label
                    : placeholder || "Select an option" }
                  <ChevronsUpDown className="opacity-50" />
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
          </FormControl>
          { description && <FormDescription>{ description }</FormDescription> }
          { error && <FormMessage>{ error.message }</FormMessage> }
        </FormItem>
      ) }
    />
  );
};
