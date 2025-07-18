import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { TeacherDashboard } from "@/components/teacher/TeacherDashboard";
import { StudentDashboard } from "@/components/student/StudentDashboard";

interface User {
  id: string;
  email: string;
  role: 'teacher' | 'student';
  name: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  if (user.role === 'teacher') {
    return <TeacherDashboard user={user} onLogout={handleLogout} />;
  }

  return <StudentDashboard user={user} onLogout={handleLogout} />;
};

export default Index;
