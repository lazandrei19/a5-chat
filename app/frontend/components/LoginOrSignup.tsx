import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chrome, Github } from "lucide-react";
// @ts-ignore
import { router } from '@inertiajs/react'
import { useState } from "react";

export function LoginOrSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  const signup = () => {
    router.post(
      "/users",
      {
        user: {
          email,
          password,
          password_confirmation: password,
        },
      },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  const login = () => {
    router.post(
      "/users/sign_in",
      {
        user: {
          email,
          password,
        },
      },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeTab === 'login') {
        login();
      } else {
        signup();
      }
    }
  };

  return (
    <Tabs defaultValue="login" className="w-[400px]" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Welcome back.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="space-y-1">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={login}>Login</Button>
          </CardFooter>
          <div className="flex flex-col space-y-2 p-6">
            <Button variant="outline"><Chrome className="size-4"/>Login with Google</Button>
            <Button variant="outline"><Github className="size-4"/>Login with Github</Button>
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
            <CardDescription>
              Create a new account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="space-y-1">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={signup}>Sign up</Button>
          </CardFooter>
          <div className="flex flex-col space-y-2 p-6">
            <Button variant="outline"><Chrome className="size-4"/>Sign up with Google</Button>
            <Button variant="outline"><Github className="size-4"/>Sign up with Github</Button>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
} 