'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { prioritizeCase, PrioritizeCaseInput, PrioritizeCaseOutput } from '@/ai/flows/ai-powered-case-prioritization';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  outstandingAmount: z.coerce.number().positive(),
  daysOverdue: z.coerce.number().int().positive(),
  customerPaymentHistory: z.string().min(10),
  invoiceData: z.string().min(10),
  customerHistory: z.string().min(10),
});

interface PrioritizeCaseProps {
  defaultValues: PrioritizeCaseInput;
}

export function PrioritizeCase({ defaultValues }: PrioritizeCaseProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PrioritizeCaseOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        outstandingAmount: defaultValues.outstandingAmount,
        daysOverdue: defaultValues.daysOverdue,
        customerPaymentHistory: 'Consistent on-time payments until last two invoices.',
        invoiceData: `Invoice INV-2023-12-01, Amount: ${defaultValues.outstandingAmount}`,
        customerHistory: 'Long-standing customer, 5+ years.'
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const output = await prioritizeCase(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to prioritize case. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Case Prioritization</CardTitle>
        <CardDescription>Let AI determine the priority of this case based on key factors.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="outstandingAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outstanding Amount</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="daysOverdue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days Overdue</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="customerPaymentHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Payment History</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Prioritize Case
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-6 rounded-lg border bg-secondary/50 p-4">
            <h4 className="font-semibold text-lg mb-2">AI Prioritization Result</h4>
            <div className="space-y-2">
              <p><strong>Priority Score:</strong> {result.priorityScore} / 100</p>
              <p><strong>Priority Tag:</strong> <span className="font-bold text-primary">{result.priorityTag}</span></p>
              <p><strong>Reasoning:</strong> {result.reasoning}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
