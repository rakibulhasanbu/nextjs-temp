"use client";

import { CustomFormCheckbox } from "@/components/custom-ui/custom-form-checkbox";
import { CustomFormDatePicker } from "@/components/custom-ui/custom-form-date-picker";
import { CustomFormDateRangePicker } from "@/components/custom-ui/custom-form-date-range-picker";
import { CustomFormInput } from "@/components/custom-ui/custom-form-input";
import { CustomFormMultiSelect } from "@/components/custom-ui/custom-form-multi-select";
import { CustomFormSearchSelect } from "@/components/custom-ui/custom-form-search-select";
import { CustomFormSelect } from "@/components/custom-ui/custom-form-select";
import { CustomFormSwitch } from "@/components/custom-ui/custom-form-switch";
import { CustomFormTextarea } from "@/components/custom-ui/custom-form-textarea";
import { CustomRadioGroup } from "@/components/custom-ui/custom-radio-group";
import { CustomRadioGroupCard } from "@/components/custom-ui/custom-radio-group-card";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1),
  multiSelect: z.string().min(1),
  searchSelect: z.string().min(1),
  gender: z.string().min(1),
  description: z.string().min(1),
  switch: z.boolean(),
  radioGroup: z.string().min(1),
  radioGroupCard: z.string().min(1),
  checkboxGroup: z.array(z.string()).min(1, "Select at least one option"),
  birthDate: z.date({ error: "Birth date is required" }),
  appointmentDate: z.date().optional(),
  vacationDateRange: z.object({
    from: z.date({ error: "Start date is required" }),
    to: z.date().optional(),
  }).refine((data) => {
    if (data.to && data.from) {
      return data.to >= data.from;
    }
    return true;
  }, {
    message: "End date must be after start date",
  }),
});

export default function Page () {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      multiSelect: "",
      searchSelect: "",
      gender: "",
      description: "",
      switch: false,
      radioGroup: "",
      radioGroupCard: "",
      checkboxGroup: [],
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-svh p-6">
      <h1 className="text-2xl font-bold">Hello World</h1>

      <form onSubmit={ form.handleSubmit(onSubmit) }>
        <FieldGroup className="w-sm">
          <CustomFormInput
            name="name"
            label="Name"
            placeholder="Enter your name"
            control={ form.control }
            required
          />

          <CustomFormSelect
            name="gender"
            label="Gender"
            placeholder="Enter your gender"
            control={ form.control }
            required
            options={ [
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ] }
          />

          <CustomFormMultiSelect
            name="multiSelect"
            label="Multi Select"
            placeholder="Enter your multi select"
            control={ form.control }
            required
            options={ [
              { value: "car", label: "Car" },
              { value: "bike", label: "Bike" },
              { value: "bus", label: "Bus" },
              { value: "train", label: "Train" },
              { value: "plane", label: "Plane" },
            ] }
          />

          <CustomFormSearchSelect
            name="searchSelect"
            label="Search Select"
            placeholder="Enter your search select"
            control={ form.control }
            required
            options={ [
              { value: "apple", label: "Apple" },
              { value: "banana", label: "Banana" },
              { value: "cherry", label: "Cherry" },
              { value: "date", label: "Date" },
              { value: "elderberry", label: "Elderberry" },
            ] }
          />

          <CustomFormSwitch
            name="switch"
            label="Switch"
            control={ form.control }
            required
          />

          <CustomFormTextarea
            name="description"
            label="Description"
            placeholder="Enter your description"
            control={ form.control }
            required
          />

          <CustomRadioGroup
            name="radioGroup"
            label="Radio Group"
            control={ form.control }
            orientation="horizontal"
            options={ [
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ] }
          />

          <CustomRadioGroupCard
            name="radioGroupCard"
            label="Radio Group Card"
            control={ form.control }
            options={ [
              { value: "male", label: "Male", description: "Select if you identify as male" },
              { value: "female", label: "Female", description: "Select if you identify as female" },
              { value: "other", label: "Other", description: "Select if you identify as other" },
            ] }
          />

          <CustomFormCheckbox
            name="checkboxGroup"
            label="Interests"
            description="Select additional features you'd like to include."
            control={ form.control }
            required
            options={ [
              { value: "sports", label: "Sports", description: "Athletic activities and games" },
              { value: "music", label: "Music", description: "Playing or listening to music" },
              { value: "reading", label: "Reading", description: "Books, articles, and literature" },
              { value: "travel", label: "Travel", description: "Exploring new places and cultures" },
            ] }
          />

          <CustomFormDatePicker
            name="birthDate"
            label="Birth Date"
            placeholder="Select your birth date"
            description="Your date of birth"
            control={ form.control }
            required
            disableFutureDates
          />

          <CustomFormDatePicker
            name="appointmentDate"
            label="Appointment Date"
            placeholder="Select appointment date"
            description="Schedule a future appointment"
            control={ form.control }
            disablePastDates
          />

          <CustomFormDateRangePicker
            name="vacationDateRange"
            label="Vacation Date Range"
            placeholder="Select vacation period"
            description="Choose your vacation start and end dates"
            control={ form.control }
            required
            disablePastDates
            numberOfMonths={ 2 }
          />

          <Button type="submit">Submit</Button>

        </FieldGroup>
      </form>
    </div>
  )
}
