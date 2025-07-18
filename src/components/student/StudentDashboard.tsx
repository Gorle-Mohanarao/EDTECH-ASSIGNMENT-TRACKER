import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, LogOut, FileText, Clock, CheckCircle } from "lucide-react";
import { SubmitAssignment } from "./SubmitAssignment";

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

interface StudentDashboardProps {
  user: { id: string; email: string; role: 'teacher' | 'student'; name: string };
  onLogout: () => void;
}

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "React Fundamentals Essay",
      description: "Write a comprehensive essay about React fundamentals covering components, props, state, and lifecycle methods.",
      dueDate: "2024-01-15",
      status: "graded",
      grade: 85,
      feedback: "Great work! Your understanding of React concepts is clear.",
      teacherName: "Prof. Johnson"
    },
    {
      id: "2",
      title: "Database Design Project",
      description: "Design a database schema for an e-commerce platform with proper normalization and relationships.",
      dueDate: "2024-01-20",
      status: "submitted",
      teacherName: "Prof. Smith"
    },
    {
      id: "3",
      title: "JavaScript Algorithms",
      description: "Implement and analyze the time complexity of common sorting algorithms.",
      dueDate: "2024-01-25",
      status: "pending",
      teacherName: "Prof. Williams"
    }
  ]);

  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const handleSubmitAssignment = (assignmentId: string, content: string) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: 'submitted' as const }
          : assignment
      )
    );
    setSelectedAssignment(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-education-orange text-white';
      case 'submitted': return 'bg-primary text-primary-foreground';
      case 'graded': return 'bg-accent text-accent-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'submitted': return <FileText className="h-4 w-4" />;
      case 'graded': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-accent";
    if (grade >= 80) return "text-primary";
    if (grade >= 70) return "text-education-orange";
    return "text-destructive";
  };

  if (selectedAssignment) {
    return (
      <SubmitAssignment
        assignment={selectedAssignment}
        onBack={() => setSelectedAssignment(null)}
        onSubmit={handleSubmitAssignment}
        user={user}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-2">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">EduTrack</h1>
                <p className="text-sm text-muted-foreground">Student Dashboard</p>
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

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">My Assignments</h2>
          <p className="text-muted-foreground">Track your assignments and submissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{assignments.length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-education-orange">
                {assignments.filter(a => a.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {assignments.filter(a => a.status === 'submitted').length}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Average Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {assignments.filter(a => a.grade).length > 0 
                  ? Math.round(assignments.filter(a => a.grade).reduce((sum, a) => sum + (a.grade || 0), 0) / assignments.filter(a => a.grade).length)
                  : '-'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const daysUntilDue = getDaysUntilDue(assignment.dueDate);
            const isOverdue = daysUntilDue < 0 && assignment.status === 'pending';
            
            return (
              <Card key={assignment.id} className={`shadow-soft hover:shadow-medium transition-shadow ${isOverdue ? 'border-destructive' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{assignment.title}</h3>
                        <Badge className={getStatusColor(assignment.status)}>
                          {getStatusIcon(assignment.status)}
                          <span className="ml-1 capitalize">{assignment.status}</span>
                        </Badge>
                        {assignment.grade && (
                          <Badge variant="outline" className={getGradeColor(assignment.grade)}>
                            {assignment.grade}/100
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{assignment.description}</p>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          {isOverdue && (
                            <span className="text-destructive font-semibold ml-1">
                              (Overdue)
                            </span>
                          )}
                          {daysUntilDue > 0 && assignment.status === 'pending' && (
                            <span className="text-muted-foreground ml-1">
                              ({daysUntilDue} days left)
                            </span>
                          )}
                        </div>
                        <div className="text-muted-foreground">
                          By: {assignment.teacherName}
                        </div>
                      </div>
                      {assignment.feedback && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <p className="text-sm">
                            <strong>Feedback:</strong> {assignment.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {assignment.status === 'pending' && (
                        <Button 
                          onClick={() => setSelectedAssignment(assignment)}
                          className="bg-gradient-primary hover:opacity-90"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Submit
                        </Button>
                      )}
                      {assignment.status === 'submitted' && (
                        <Button variant="outline" disabled>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Submitted
                        </Button>
                      )}
                      {assignment.status === 'graded' && (
                        <Button variant="outline" disabled>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Graded
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {assignments.length === 0 && (
          <Card className="shadow-soft">
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No assignments yet</h3>
              <p className="text-muted-foreground">Your teachers haven't assigned any work yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}