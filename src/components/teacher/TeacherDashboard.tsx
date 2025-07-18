import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen, Users, Calendar, LogOut } from "lucide-react";
import { CreateAssignmentForm } from "./CreateAssignmentForm";
import { ViewSubmissions } from "./ViewSubmissions";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
  status: 'active' | 'closed' | 'draft';
}

interface TeacherDashboardProps {
  user: { id: string; email: string; role: 'teacher' | 'student'; name: string };
  onLogout: () => void;
}

export function TeacherDashboard({ user, onLogout }: TeacherDashboardProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "React Fundamentals Essay",
      description: "Write a comprehensive essay about React fundamentals",
      dueDate: "2024-01-15",
      submissions: 12,
      totalStudents: 25,
      status: "active"
    },
    {
      id: "2",
      title: "Database Design Project",
      description: "Design a database schema for an e-commerce platform",
      dueDate: "2024-01-20",
      submissions: 8,
      totalStudents: 25,
      status: "active"
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const handleCreateAssignment = (assignmentData: Omit<Assignment, 'id' | 'submissions' | 'totalStudents'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: Math.random().toString(36).substr(2, 9),
      submissions: 0,
      totalStudents: 25
    };
    setAssignments([...assignments, newAssignment]);
    setShowCreateForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-accent text-accent-foreground';
      case 'closed': return 'bg-destructive text-destructive-foreground';
      case 'draft': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  if (selectedAssignment) {
    return (
      <ViewSubmissions
        assignment={selectedAssignment}
        onBack={() => setSelectedAssignment(null)}
        user={user}
        onLogout={onLogout}
      />
    );
  }

  if (showCreateForm) {
    return (
      <CreateAssignmentForm
        onSubmit={handleCreateAssignment}
        onCancel={() => setShowCreateForm(false)}
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
                <p className="text-sm text-muted-foreground">Teacher Dashboard</p>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">My Assignments</h2>
            <p className="text-muted-foreground">Manage and track your assignments</p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <CardTitle className="text-lg">Active Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {assignments.filter(a => a.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-education-orange">
                {assignments.reduce((sum, a) => sum + a.submissions, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{assignment.title}</h3>
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{assignment.description}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {assignment.submissions}/{assignment.totalStudents} submitted
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedAssignment(assignment)}
                  >
                    View Submissions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {assignments.length === 0 && (
          <Card className="shadow-soft">
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No assignments yet</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first assignment</p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}