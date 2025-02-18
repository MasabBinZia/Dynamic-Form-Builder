import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { FormDefinition, FormSection as IFormSection } from "./types";
import FormSection from "./FormSection";
import FormPreview from "./FormPreview";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import ErrorBoundary from "@/components/ErrorBoundary";

const FormBuilder = () => {
  const [formDefinition, setFormDefinition] = useState<FormDefinition>({
    sections: [],
  });

  const addSection = () => {
    const newSection: IFormSection = {
      id: crypto.randomUUID(),
      title: "New Section",
      fields: [],
    };
    setFormDefinition({
      ...formDefinition,
      sections: [...formDefinition.sections, newSection],
    });
  };

  const updateSection = (sectionId: string, updatedSection: IFormSection) => {
    setFormDefinition({
      ...formDefinition,
      sections: formDefinition.sections.map((section) =>
        section.id === sectionId ? updatedSection : section
      ),
    });
  };

  const deleteSection = (sectionId: string) => {
    setFormDefinition({
      ...formDefinition,
      sections: formDefinition.sections.filter(
        (section) => section.id !== sectionId
      ),
    });
  };

  return (
    <ErrorBoundary>
      <div className="form-builder-container">
        <Tabs defaultValue="builder" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="builder">Form Builder</TabsTrigger>
            <TabsTrigger value="preview">Preview & Test</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            {formDefinition.sections.map((section) => (
              <FormSection
                key={section.id}
                section={section}
                onUpdate={(updatedSection) =>
                  updateSection(section.id, updatedSection)
                }
                onDelete={() => deleteSection(section.id)}
              />
            ))}

            <Button variant="outline" className="w-full" onClick={addSection}>
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Form Structure</h3>
              <pre className="json-preview">
                {JSON.stringify(formDefinition, null, 2)}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <FormPreview formDefinition={formDefinition} />
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default FormBuilder;
