'use client';

import { useRouter } from 'next/navigation';
import { BrainCircuit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import type { UserRole } from '@/lib/types';
import { USERS } from '@/lib/data';

export default function Home() {
  const { login } = useUser();
  const router = useRouter();

  const handleLogin = (role: UserRole) => {
    const user = USERS.find((u) => u.role === role);
    if (user) {
      login(user);
      router.push('/dashboard');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <BrainCircuit className="h-10 w-10" />
          <h1 className="text-4xl font-bold tracking-tighter">DebtFlow AI</h1>
        </div>
        <p className="text-muted-foreground">
          Intelligent Debt Collection Management
        </p>

        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Select a Role</CardTitle>
            <CardDescription>
              Choose a user role to explore the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button onClick={() => handleLogin('FedEx Admin')}>
              FedEx Admin
            </Button>
            <Button onClick={() => handleLogin('FedEx Employee')} variant="secondary">
              FedEx Employee
            </Button>
            <Button onClick={() => handleLogin('Agency Admin')} variant="secondary">
              Agency Admin
            </Button>
            <Button onClick={() => handleLogin('Agency Employee')} variant="secondary">
              Agency Employee
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
