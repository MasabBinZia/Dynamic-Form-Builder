import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormDefinition } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { PhoneInput } from "@/components/ui/phone-input";

interface FormPreviewProps {
  formDefinition: FormDefinition;
}

const FormPreview = ({ formDefinition }: FormPreviewProps) => {
  const [formData, setFormData] = useState<any>(null);

  // Create dynamic schema based on field types
  const formSchema = z.object(
    Object.fromEntries(
      formDefinition.sections.flatMap((section) =>
        section.fields.map((field) => {
          let fieldSchema;

          // Apply field type specific validation
          switch (field.type) {
            case "email":
              fieldSchema = z.string().email("Invalid email address");
              break;
            case "number":
              fieldSchema = z.string().regex(/^\d+$/, "Must be a number");
              break;
            case "tel":
              fieldSchema = z.string().min(1, "Phone number is required");
              break;
            case "checkbox":
              fieldSchema = z.boolean().default(false);
              break;
            case "select":
            case "radio":
              fieldSchema = z.string();
              break;
            case "country":
              fieldSchema = z.string();
              break;
            case "date":
              fieldSchema = z.date().nullable();
              break;
            default:
              fieldSchema = z.string();
          }

          // Apply required validation
          if (field.required) {
            fieldSchema = fieldSchema.refine(
              (val) => {
                if (typeof val === "string") {
                  return val.trim().length > 0;
                }
                return val !== undefined && val !== null;
              },
              {
                message: `${field.label} is required`,
              }
            );
          }

          return [field.id, fieldSchema];
        })
      )
    )
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur", // Validate on blur for better UX
    defaultValues: Object.fromEntries(
      formDefinition.sections.flatMap((section) =>
        section.fields.map((field) => [
          field.id,
          field.type === "checkbox" ? false : "",
        ])
      )
    ),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Create a mapping of field IDs to labels
    const fieldLabels = formDefinition.sections
      .flatMap((section) =>
        section.fields.map((field) => ({
          id: field.id,
          label: field.label,
        }))
      )
      .reduce(
        (acc, field) => ({
          ...acc,
          [field.id]: field.label,
        }),
        {}
      );

    // Format the data using field labels
    const formattedData = Object.entries(data)
      .map(([key, value]) => `${fieldLabels[key]}: ${value}`)
      .join("\n");

    setFormData(formattedData);
    console.log("Form submitted:", data);
  };

  const renderField = (field: any, formField: any) => {
    switch (field.type) {
      case "tel":
        return (
          <PhoneInput
            value={formField.value}
            onChange={(value) => formField.onChange(value)}
            placeholder={field.placeholder || "Enter phone number"}
            defaultCountry="US"
          />
        );
      case "country":
        return (
          <CountryDropdown
            onChange={(country) => formField.onChange(country.alpha3)}
            defaultValue={formField.value}
            placeholder={field.placeholder || "Select a country"}
          />
        );
      case "select":
        return (
          <Select value={formField.value} onValueChange={formField.onChange}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "checkbox":
        return (
          <Checkbox
            checked={formField.value}
            onCheckedChange={formField.onChange}
          />
        );
      case "radio":
        return (
          <RadioGroup
            value={formField.value}
            onValueChange={formField.onChange}
          >
            {field.options?.map((option: any) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} />
                <Label>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formField.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formField.value
                  ? format(new Date(formField.value), "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  formField.value ? new Date(formField.value) : undefined
                }
                onSelect={formField.onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      default:
        return (
          <Input
            {...formField}
            type={field.type}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {formDefinition.sections.map((section) => (
            <Card key={section.id} className="">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="grid lg:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.id}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl>
                          {renderField(field, formField)}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
            </Card>
          ))}
          <Button type="submit" className="w-full">
            Submit Form
          </Button>
        </form>
      </Form>

      {/* Preview submitted data */}
      {formData && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Submitted Data</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-auto whitespace-pre-line">
            {formData}
          </pre>
        </div>
      )}
    </div>
  );
};

export default FormPreview;
