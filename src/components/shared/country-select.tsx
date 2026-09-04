"use client";

import { getCountries, getCountryCallingCode, type Country } from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";

import { InputGroupAddon } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CountrySelectProps = {
  value: Country;
  onChange: (country: Country) => void;
  disabled?: boolean;
  readOnly?: boolean;
};

export const CountrySelect = ({ value, onChange, disabled, readOnly }: CountrySelectProps) => {
  return (
    <InputGroupAddon>
      <Select
        value={value}
        onValueChange={(next) => next && onChange(next as Country)}
        disabled={disabled || readOnly}
      >
        <SelectTrigger className="h-6 w-20 border-0 bg-transparent px-1 shadow-none">
          <SelectValue>+{getCountryCallingCode(value)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {getCountries().map((country) => (
            <SelectItem key={country} value={country}>
              {en[country]} (+{getCountryCallingCode(country)})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </InputGroupAddon>
  );
};
