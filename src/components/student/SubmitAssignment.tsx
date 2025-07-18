import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, LogOut, Send, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  feedback?: string;
  teacherName: string;
}

interface SubmitAssignmentProps {
  assignment: Assignment;
  onBack: () => void;
  onSubmit: (assignmentId: string, content: string) => void;
  user: { id: string; email: string; role: 'teacher' | 'student'; name: string };
  onLogout: () => void;
}

export function SubmitAssignment({ assignment, onBack, onSubmit, user, onLogout }: SubmitAssignmentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      onSubmit(assignment.id, content);
      toast({
        title: "Assignment submitted!",
        description: "Your submission has been sent to your teacher."
      });
      setIsLoading(false);
    }, 1000);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue(assignment.dueDate);
  const isOverdue = daysUntilDue < 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="bg-primary rounded-full p-2">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">EduTrack</h1>
                <p className="text-sm text-muted-foreground">Submit Assignment</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">Student</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assignment Details */}
          <div className="lg:col-span-1">
            <Card className="shadow-large sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl">{assignment.title}</CardTitle>
                <CardDescription>Assignment Details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span className="text-muted-foreground">Teacher:</span>
                  <span>{assignment.teacherName}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className="text-muted-foreground">Due Date:</span>
                  <span className={isOverdue ? "text-destructive font-semibold" : ""}>
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                </div>
                
                {daysUntilDue > 0 && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Time remaining:</span>
                    <span className="ml-2 font-semibold text-accent">
                      {daysUntilDue} days
                    </span>
                  </div>
                )}
                
                {isOverdue && (
                  <div className="text-sm">
                    <span className="text-destructive font-semibold">
                      This assignment is overdue
                    </span>
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Instructions:</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {assignment.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submission Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-large">
              <CardHeader>
                <CardTitle className="text-xl">Submit Your Work</CardTitle>
                <CardDescription>
                  Complete your assignment and submit it to your teacher
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="content">Your Submission</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Type your assignment submission here..."
                      rows={15}
                      className="min-h-[400px]"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      {content.length} characters
                    </p>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Submission Guidelines:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Make sure to address all parts of the assignment</li>
                      <li>• Review your work before submitting</li>
                      <li>• Once submitted, you cannot edit your submission</li>
                      <li>• Your teacher will review and provide feedback</li>
                    </ul>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onBack}
                      className="flex-1"
                    >
                      Back to Dashboard
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading || !content.trim()}
                      className="flex-1 bg-gradient-primary hover:opacity-90"
                    >
                      {isLoading ? (
                        "Submitting..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Assignment
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}