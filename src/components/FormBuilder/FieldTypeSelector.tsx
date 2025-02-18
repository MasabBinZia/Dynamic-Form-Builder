
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldType } from "./types";

interface FieldTypeSelectorProps {
  value: FieldType;
  onChange: (value: FieldType) => void;
}

const FieldTypeSelector = ({ value, onChange }: FieldTypeSelectorProps) => {
  const fieldTypes: { value: FieldType; label: string }[] = [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "email", label: "Email" },
    { value: "tel", label: "Phone" },
    { value: "date", label: "Date" },
    { value: "file", label: "File Upload" },
    { value: "select", label: "Dropdown" },
    { value: "radio", label: "Radio" },
    { value: "checkbox", label: "Checkbox" },
    { value: "country", label: "Country" },
  ];

  return (
    <Select value={value} onValueChange={onChange as any}>
      <SelectTrigger className="field-type-selector">
        <SelectValue placeholder="Select field type" />
      </SelectTrigger>
      <SelectContent>
        {fieldTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FieldTypeSelector;
