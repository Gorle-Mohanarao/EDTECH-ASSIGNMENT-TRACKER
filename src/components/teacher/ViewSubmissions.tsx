import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, BookOpen, LogOut, User, Calendar, FileText, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
  status: 'active' | 'closed' | 'draft';
}

interface Submission {
  id: string;
  studentName: string;
  studentEmail: string;
  content: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
}

interface ViewSubmissionsProps {
  assignment: Assignment;
  onBack: () => void;
  user: { id: string; email: string; role: 'teacher' | 'student'; name: string };
  onLogout: () => void;
}

export function ViewSubmissions({ assignment, onBack, user, onLogout }: ViewSubmissionsProps) {
  const [submissions] = useState<Submission[]>([
    {
      id: "1",
      studentName: "Alice Johnson",
      studentEmail: "alice.johnson@student.edu",
      content: "This is my comprehensive essay on React fundamentals. React is a JavaScript library for building user interfaces, particularly web applications. It was created by Facebook and has become one of the most popular frontend frameworks. The key concepts include components, props, state, and the virtual DOM...",
      submittedAt: "2024-01-10T10:30:00Z",
      grade: 85,
      feedback: "Great work! Your understanding of React concepts is clear."
    },
    {
      id: "2",
      studentName: "Bob Smith",
      studentEmail: "bob.smith@student.edu",
      content: "React fundamentals essay: React is a powerful library that revolutionized how we build user interfaces. It introduces a component-based architecture that makes code more reusable and maintainable. The virtual DOM is one of its key innovations...",
      submittedAt: "2024-01-12T14:15:00Z"
    },
    {
      id: "3",
      studentName: "Carol Williams",
      studentEmail: "carol.williams@student.edu",
      content: "My analysis of React fundamentals covers the core concepts that make React so effective for building modern web applications. Starting with JSX, which allows us to write HTML-like syntax in JavaScript...",
      submittedAt: "2024-01-11T09:45:00Z",
      grade: 92,
      feedback: "Excellent analysis! Your examples are particularly well-chosen."
    }
  ]);

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const { toast } = useToast();

  const handleGradeSubmission = (submissionId: string, grade: number, feedback: string) => {
    toast({
      title: "Grade submitted!",
      description: "The student has been notified of their grade."
    });
    setSelectedSubmission(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-accent";
    if (grade >= 80) return "text-primary";
    if (grade >= 70) return "text-education-orange";
    return "text-destructive";
  };

  if (selectedSubmission) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card shadow-soft">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => setSelectedSubmission(null)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="bg-primary rounded-full p-2">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">EduTrack</h1>
                  <p className="text-sm text-muted-foreground">Grade Submission</p>
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

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Submission Content */}
            <Card className="shadow-large">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5" />
                  <div>
                    <CardTitle>{selectedSubmission.studentName}</CardTitle>
                    <CardDescription>{selectedSubmission.studentEmail}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Submitted: {formatDate(selectedSubmission.submittedAt)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Assignment: {assignment.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Student Submission:</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm leading-relaxed">{selectedSubmission.content}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grading Form */}
            <Card className="shadow-large">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Grade Submission
                </CardTitle>
                <CardDescription>
                  Provide a grade and feedback for this submission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const grade = parseInt(formData.get('grade') as string);
                    const feedback = formData.get('feedback') as string;
                    handleGradeSubmission(selectedSubmission.id, grade, feedback);
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade (0-100)</Label>
                    <Input
                      id="grade"
                      name="grade"
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={selectedSubmission.grade || ""}
                      placeholder="Enter grade"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback</Label>
                    <Textarea
                      id="feedback"
                      name="feedback"
                      placeholder="Provide feedback to help the student improve..."
                      rows={6}
                      defaultValue={selectedSubmission.feedback || ""}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">
                    Submit Grade & Feedback
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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
                <p className="text-sm text-muted-foreground">View Submissions</p>
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

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">{assignment.title}</h2>
          <p className="text-muted-foreground mb-4">{assignment.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="outline">
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </Badge>
            <Badge variant="outline">
              {submissions.length} submissions
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission.id} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">{submission.studentName}</h3>
                        <p className="text-sm text-muted-foreground">{submission.studentEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(submission.submittedAt)}
                      </div>
                      {submission.grade && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          <span className={`font-semibold ${getGradeColor(submission.grade)}`}>
                            {submission.grade}/100
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {submission.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {submission.grade ? (
                      <Badge className="bg-accent text-accent-foreground">
                        Graded
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Pending
                      </Badge>
                    )}
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {submissions.length === 0 && (
          <Card className="shadow-soft">
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
              <p className="text-muted-foreground">Students haven't submitted their work yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}