import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, BookOpen, LogOut, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Assignment {
  title: string;
  description: string;
  dueDate: string;
  status: 'active' | 'closed' | 'draft';
}

interface CreateAssignmentFormProps {
  onSubmit: (assignment: Assignment) => void;
  onCancel: () => void;
  user: { id: string; email: string; role: 'teacher' | 'student'; name: string };
  onLogout: () => void;
}

export function CreateAssignmentForm({ onSubmit, onCancel, user, onLogout }: CreateAssignmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const assignment: Assignment = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      dueDate: formData.get('dueDate') as string,
      status: formData.get('status') as 'active' | 'closed' | 'draft'
    };

    // Simulate API call
    setTimeout(() => {
      onSubmit(assignment);
      toast({
        title: "Assignment created!",
        description: "Your assignment has been created successfully."
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="bg-primary rounded-full p-2">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">EduTrack</h1>
                <p className="text-sm text-muted-foreground">Create Assignment</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">Teacher</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-large">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Assignment</CardTitle>
            <CardDescription>
              Fill in the details for your assignment. Students will be able to see and submit to it once published.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Assignment Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., React Fundamentals Essay"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide detailed instructions for your assignment..."
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                >
                  {isLoading ? (
                    "Creating..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Assignment
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}