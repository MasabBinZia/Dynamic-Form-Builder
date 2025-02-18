
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { FormSection as IFormSection, FormField as IFormField } from "./types";
import FormField from "./FormField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormSectionProps {
  section: IFormSection;
  onUpdate: (section: IFormSection) => void;
  onDelete: () => void;
}

const FormSection = ({ section, onUpdate, onDelete }: FormSectionProps) => {
  const addField = () => {
    const newField: IFormField = {
      id: crypto.randomUUID(),
      type: "text",
      label: "",
      required: false,
    };
    onUpdate({
      ...section,
      fields: [...section.fields, newField],
    });
  };

  const updateField = (fieldId: string, updatedField: IFormField) => {
    onUpdate({
      ...section,
      fields: section.fields.map((field) =>
        field.id === fieldId ? updatedField : field
      ),
    });
  };

  const deleteField = (fieldId: string) => {
    onUpdate({
      ...section,
      fields: section.fields.filter((field) => field.id !== fieldId),
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">
          <Input
            value={section.title}
            onChange={(e) =>
              onUpdate({ ...section, title: e.target.value })
            }
            placeholder="Section Title"
            className="text-xl font-semibold bg-transparent border-none hover:bg-secondary/50 focus:bg-secondary/50 transition-colors"
          />
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive/90"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {section.fields.map((field) => (
          <FormField
            key={field.id}
            field={field}
            onUpdate={(updatedField) => updateField(field.id, updatedField)}
            onDelete={() => deleteField(field.id)}
          />
        ))}
        <Button
          variant="outline"
          className="w-full"
          onClick={addField}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Field
        </Button>
      </CardContent>
    </Card>
  );
};

export default FormSection;
