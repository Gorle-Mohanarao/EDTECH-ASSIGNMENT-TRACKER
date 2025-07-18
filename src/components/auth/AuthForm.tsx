import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Users, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  onAuthSuccess: (user: { id: string; email: string; role: 'teacher' | 'student'; name: string }) => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, isSignUp: boolean) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const role = formData.get('role') as 'teacher' | 'student';

    // Simulate authentication (replace with Supabase auth)
    setTimeout(() => {
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: name || email.split('@')[0],
        role: role || 'student'
      };
      
      onAuthSuccess(user);
      toast({
        title: isSignUp ? "Account created!" : "Welcome back!",
        description: `Logged in as ${role === 'teacher' ? 'Teacher' : 'Student'}`
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-hero">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">EduTrack</h1>
          <p className="text-white/80">Assignment tracking made simple</p>
        </div>

        <Card className="shadow-large">
          <CardHeader>
            <CardTitle className="text-center">Get Started</CardTitle>
            <CardDescription className="text-center">
              Join thousands of teachers and students using EduTrack
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">I am a</Label>
                    <Select name="role" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Student
                          </div>
                        </SelectItem>
                        <SelectItem value="teacher">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Teacher
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-primary hover:opacity-90" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">I am a</Label>
                    <Select name="role" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Student
                          </div>
                        </SelectItem>
                        <SelectItem value="teacher">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Teacher
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-primary hover:opacity-90" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}