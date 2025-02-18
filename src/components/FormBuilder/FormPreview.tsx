
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormDefinition } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface FormPreviewProps {
  formDefinition: FormDefinition;
}

const FormPreview = ({ formDefinition }: FormPreviewProps) => {
  const [formData, setFormData] = useState<any>(null);

  // Create dynamic validation schema based on form definition
  const createValidationSchema = () => {
    const schemaMap: { [key: string]: any } = {};
    
    formDefinition.sections.forEach((section) => {
      section.fields.forEach((field) => {
        let fieldSchema: any = z.string();
        
        // Apply field type-specific validation
        if (field.type === "email") {
          fieldSchema = z.string().email({ message: "Invalid email address" });
        } else if (field.type === "number") {
          fieldSchema = z.string().pipe(z.coerce.number());
        } else if (field.type === "tel") {
          fieldSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, {
            message: "Invalid phone number",
          });
        }

        // Apply custom validation rules
        if (field.validationRules) {
          field.validationRules.forEach((rule) => {
            switch (rule.type) {
              case "min":
                fieldSchema = fieldSchema.min(Number(rule.value), rule.message);
                break;
              case "max":
                fieldSchema = fieldSchema.max(Number(rule.value), rule.message);
                break;
              case "email":
                fieldSchema = fieldSchema.email(rule.message);
                break;
              case "regex":
                if (rule.value && typeof rule.value === 'string') {
                  fieldSchema = fieldSchema.regex(new RegExp(rule.value), rule.message);
                }
                break;
            }
          });
        }

        // Apply required validation
        schemaMap[field.id] = field.required ? fieldSchema : fieldSchema.optional();
      });
    });

    return z.object(schemaMap);
  };

  const schema = createValidationSchema();
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    setFormData(data);
  };

  return (
    <div className="space-y-8">
      <div className="form-preview glass-panel">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {formDefinition.sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      {...form.register(field.id)}
                      className={form.formState.errors[field.id] ? "border-destructive animate-shake" : ""}
                    />
                    {form.formState.errors[field.id] && (
                      <p className="validation-error">
                        {form.formState.errors[field.id]?.message as string}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          <Button type="submit" className="w-full">
            Submit Form
          </Button>
        </form>
      </div>

      {formData && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Submitted Data</h3>
          <pre className="json-preview">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default FormPreview;
