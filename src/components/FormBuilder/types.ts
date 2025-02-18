
import { z } from "zod";

export type FieldType = 
  | "text"
  | "number"
  | "email"
  | "tel"
  | "date"
  | "file"
  | "select"
  | "radio"
  | "checkbox"
  | "country";

export interface ValidationRule {
  type: "min" | "max" | "email" | "regex" | "custom";
  value?: string | number;
  message: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  validationRules?: ValidationRule[];
  options?: string[];
  conditionalDisplay?: {
    dependsOn: string;
    value: string;
  };
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
  sections?: FormSection[];
}

export interface FormDefinition {
  sections: FormSection[];
}
