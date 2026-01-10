'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/hooks/use-user';
import { USERS } from '@/lib/data';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function Home() {
  const { login } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('signin');

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = (values: z.infer<typeof loginFormSchema>) => {
    // This is a simplified login. In a real app, you'd validate against a backend.
    const user = USERS.find((u) => u.email.toLowerCase() === values.email.toLowerCase());

    if (user) {
      login(user);
      router.push('/dashboard');
    } else {
      form.setError('email', {
        type: 'manual',
        message: 'No user found with this email.',
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-primary/90 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            FedEx DCA
          </CardTitle>
          <CardDescription>Debt Collection Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleLogin)}
                  className="space-y-6 pt-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your.email@fedex.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-primary" size="lg">
                    Sign In
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="signup">
              <div className="py-12 text-center text-muted-foreground">
                <p>Sign up is not yet available.</p>
              </div>
            </TabsContent>
          </Tabs>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Demo Credentials:</p>
            <p>aditi.sharma@fedex.com / admin123</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
