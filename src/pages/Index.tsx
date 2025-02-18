
import FormBuilder from "@/components/FormBuilder";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Dynamic Form Builder
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Create beautiful, dynamic forms with real-time validation
        </p>
        <FormBuilder />
        
        <footer className="mt-12 pb-6 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center mb-2">
            <span>Built with ❤️ by Masab Bin Zia</span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              asChild
            >
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                <Github className="h-10 w-10" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          </div>
          <p className="text-xs opacity-70">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
