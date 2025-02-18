
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { FormField as IFormField, ValidationRule } from "./types";
import FieldTypeSelector from "./FieldTypeSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormFieldProps {
  field: IFormField;
  onUpdate: (field: IFormField) => void;
  onDelete: () => void;
}

const FormField = ({ field, onUpdate, onDelete }: FormFieldProps) => {
  const [showValidationForm, setShowValidationForm] = useState(false);
  const [newRule, setNewRule] = useState<ValidationRule>({
    type: "min",
    value: "",
    message: "",
  });

  const handleChange = (key: keyof IFormField, value: any) => {
    onUpdate({ ...field, [key]: value });
  };

  const addValidationRule = () => {
    if (!field.validationRules) {
      field.validationRules = [];
    }
    
    const updatedRules = [...field.validationRules, { ...newRule }];
    handleChange("validationRules", updatedRules);
    setNewRule({ type: "min", value: "", message: "" });
    setShowValidationForm(false);
  };

  const removeValidationRule = (index: number) => {
    const updatedRules = field.validationRules?.filter((_, i) => i !== index);
    handleChange("validationRules", updatedRules);
  };

  return (
    <div className="form-field glass-panel">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <Label>Field Type</Label>
            <FieldTypeSelector
              value={field.type}
              onChange={(value) => handleChange("type", value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Label</Label>
            <Input
              value={field.label}
              onChange={(e) => handleChange("label", e.target.value)}
              placeholder="Enter field label"
            />
          </div>

          <div className="space-y-2">
            <Label>Placeholder</Label>
            <Input
              value={field.placeholder}
              onChange={(e) => handleChange("placeholder", e.target.value)}
              placeholder="Enter placeholder text"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={field.required}
              onCheckedChange={(checked) => handleChange("required", checked)}
            />
            <Label>Required</Label>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Validation Rules</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowValidationForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </div>

            {showValidationForm && (
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Rule Type</Label>
                  <Select
                    value={newRule.type}
                    onValueChange={(value: any) => 
                      setNewRule({ ...newRule, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rule type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="min">Minimum Length</SelectItem>
                      <SelectItem value="max">Maximum Length</SelectItem>
                      <SelectItem value="email">Email Format</SelectItem>
                      <SelectItem value="regex">Regular Expression</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(newRule.type === "min" || newRule.type === "max") && (
                  <div className="space-y-2">
                    <Label>Length</Label>
                    <Input
                      type="number"
                      value={newRule.value}
                      onChange={(e) => 
                        setNewRule({ ...newRule, value: e.target.value })
                      }
                      placeholder="Enter length"
                    />
                  </div>
                )}

                {newRule.type === "regex" && (
                  <div className="space-y-2">
                    <Label>Pattern</Label>
                    <Input
                      value={newRule.value}
                      onChange={(e) => 
                        setNewRule({ ...newRule, value: e.target.value })
                      }
                      placeholder="Enter regex pattern"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Error Message</Label>
                  <Input
                    value={newRule.message}
                    onChange={(e) => 
                      setNewRule({ ...newRule, message: e.target.value })
                    }
                    placeholder="Enter error message"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={addValidationRule}>Add Rule</Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowValidationForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {field.validationRules && field.validationRules.length > 0 && (
              <div className="space-y-2">
                {field.validationRules.map((rule, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg"
                  >
                    <span className="text-sm">
                      {rule.type}: {rule.value} - {rule.message}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeValidationRule(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive/90"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FormField;
