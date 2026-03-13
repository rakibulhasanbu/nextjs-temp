import { Switch } from "@/components/ui/switch";
import { Control, FieldValues, Path, PathValue } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

type TCustomFormSwitch<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  description?: string;
  disabled?: boolean;
  defaultValue?: PathValue<T, Path<T>>;
  control: Control<T>;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  showLabels?: boolean;
  checkedLabel?: string;
  uncheckedLabel?: string;
  parentClassName?: string;
  valueMapping?: {
    true: string;
    false: string;
  };
};

export const CustomFormSwitch = <T extends FieldValues> ({
  label,
  disabled,
  name,
  description,
  control,
  defaultValue,
  required,
  className,
  parentClassName,
  labelClassName,
  descriptionClassName,
  showLabels = true,
  checkedLabel = "Yes",
  uncheckedLabel = "No",
  valueMapping,
}: TCustomFormSwitch<T>) => {
  return (
    <FormField
      control={ control }
      name={ name }
      rules={ {
        required: required ? `${ label || name } is required` : false,
      } }
      defaultValue={ defaultValue }
      render={ ({ field, fieldState: { error } }) => {
        // Transform the value for display and handle value mapping
        const displayValue = valueMapping
          ? valueMapping.true === field.value
            ? true
            : false
          : field.value;

        const handleChange = (checked: boolean) => {
          if (valueMapping) {
            field.onChange(checked ? valueMapping.true : valueMapping.false);
          } else {
            field.onChange(checked);
          }
        };

        return (
          <FormItem className={ cn("w-full h-fit", className) }>
            <div className={ cn("flex items-center gap-2", parentClassName) }>
              { label && (
                <FormLabel className={ cn("gap-1", labelClassName) }>
                  { label }
                  { required && <span className="text-red-500">*</span> }
                </FormLabel>
              ) }
              <FormControl>
                <div className="flex items-center gap-2">
                  { showLabels && (
                    <span className="font-medium">
                      ({ displayValue ? checkedLabel : uncheckedLabel })
                    </span>
                  ) }
                  <Switch
                    checked={ displayValue }
                    onCheckedChange={ handleChange }
                    disabled={ disabled }
                    { ...field }
                  />
                </div>
              </FormControl>
            </div>
            { description && (
              <FormDescription className={ descriptionClassName }>
                { description }
              </FormDescription>
            ) }
            <FormMessage>{ error?.message }</FormMessage>
          </FormItem>
        );
      } }
    />
  );
};
