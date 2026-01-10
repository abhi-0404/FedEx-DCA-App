'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { predictEscalationRisk, PredictEscalationRiskInput, PredictEscalationRiskOutput } from '@/ai/flows/risk-and-escalation-prediction';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
    caseId: z.string(),
    customerResponsePatterns: z.string().min(10),
    daysOverdue: z.coerce.number(),
    outstandingAmount: z.coerce.number(),
});

interface PredictEscalationProps {
  defaultValues: PredictEscalationRiskInput;
}

export function PredictEscalation({ defaultValues }: PredictEscalationProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictEscalationRiskOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        ...defaultValues,
        customerResponsePatterns: 'Customer has missed two promised payment dates. Last contact was 15 days ago with no response.'
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const output = await predictEscalationRisk(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to predict escalation risk. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk and Escalation Prediction</CardTitle>
        <CardDescription>Use AI to identify escalation risks and receive early warnings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerResponsePatterns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Response Patterns</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Predict Escalation Risk
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-6 rounded-lg border bg-destructive/10 p-4 text-destructive-foreground">
            <h4 className="font-semibold text-lg mb-2 text-destructive">AI Escalation Prediction</h4>
            <div className="space-y-2">
              <p><strong>Escalation Risk:</strong> {result.escalationRisk}</p>
              <div>
                <strong>Alerts:</strong>
                <ul className="list-disc pl-5">
                  {result.alerts.map((alert, index) => (
                    <li key={index}>{alert}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
