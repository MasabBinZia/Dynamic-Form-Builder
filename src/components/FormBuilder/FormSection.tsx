import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { FormSection as IFormSection, FormField as IFormField } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FieldTypeSelector from "./FieldTypeSelector";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ValidationRule {
  type: "min" | "max" | "email" | "regex"; // Add other types as needed
  message: string;
  value?: string | number; // Adjust based on your requirements
}

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
      options: [],
    };
    onUpdate({
      ...section,
      fields: [...section.fields, newField],
    });
  };

  const updateField = (fieldId: string, updates: Partial<IFormField>) => {
    onUpdate({
      ...section,
      fields: section.fields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    });
  };

  const addOption = (fieldId: string) => {
    const field = section.fields.find((f) => f.id === fieldId);
    if (field) {
      const newOption = {
        label: `Option ${(field.options?.length || 0) + 1}`,
        value: `option-${(field.options?.length || 0) + 1}`,
      };
      updateField(fieldId, {
        options: [...(field.options || []), newOption],
      });
    }
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
            onChange={(e) => onUpdate({ ...section, title: e.target.value })}
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
          <div key={field.id} className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-4">
                <FieldTypeSelector
                  value={field.type}
                  onChange={(type) => updateField(field.id, { type })}
                />
                <Input
                  value={field.label}
                  onChange={(e) =>
                    updateField(field.id, { label: e.target.value })
                  }
                  placeholder="Field Label"
                />
                <Input
                  value={field.placeholder || ""}
                  onChange={(e) =>
                    updateField(field.id, { placeholder: e.target.value })
                  }
                  placeholder="Placeholder (optional)"
                />

                {/* Required Switch */}
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${field.id}-required`}>Required</Label>
                  <Switch
                    id={`${field.id}-required`}
                    checked={field.required}
                    onCheckedChange={(checked) =>
                      updateField(field.id, { required: checked })
                    }
                  />
                </div>

                {/* Validation Rules */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Validation Rules</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newRule: ValidationRule = {
                          type: "min" as const,
                          message: "Validation error",
                        };
                        updateField(field.id, {
                          validationRules: [
                            ...(field.validationRules || []),
                            newRule,
                          ],
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Rule
                    </Button>
                  </div>
                  {field.validationRules?.map((rule, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Select
                        value={rule.type}
                        onValueChange={(value) => {
                          const newRules = [...(field.validationRules || [])];
                          newRules[index] = { ...rule, type: value as any };
                          updateField(field.id, { validationRules: newRules });
                        }}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="min">Min</SelectItem>
                          <SelectItem value="max">Max</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="regex">Regex</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={rule.value || ""}
                        onChange={(e) => {
                          const newRules = [...(field.validationRules || [])];
                          newRules[index] = { ...rule, value: e.target.value };
                          updateField(field.id, { validationRules: newRules });
                        }}
                        placeholder="Value"
                      />
                      <Input
                        value={rule.message}
                        onChange={(e) => {
                          const newRules = [...(field.validationRules || [])];
                          newRules[index] = {
                            ...rule,
                            message: e.target.value,
                          };
                          updateField(field.id, { validationRules: newRules });
                        }}
                        placeholder="Error message"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newRules = [...(field.validationRules || [])];
                          newRules.splice(index, 1);
                          updateField(field.id, { validationRules: newRules });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Options for select, radio, and checkbox */}
                {(field.type === "select" || field.type === "radio") && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Options</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(field.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    </div>
                    {field.options?.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option.label}
                          onChange={(e) => {
                            const newOptions = [...(field.options || [])];
                            newOptions[index] = {
                              ...option,
                              label: e.target.value,
                              value: e.target.value
                                .toLowerCase()
                                .replace(/\s+/g, "-"),
                            };
                            updateField(field.id, { options: newOptions });
                          }}
                          placeholder="Option Label"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteField(field.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full" onClick={addField}>
          <Plus className="mr-2 h-4 w-4" />
          Add Field
        </Button>
      </CardContent>
    </Card>
  );
};

export default FormSection;
