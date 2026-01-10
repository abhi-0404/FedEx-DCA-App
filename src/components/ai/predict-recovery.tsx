'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { predictRecoveryProbability, PredictRecoveryProbabilityInput, PredictRecoveryProbabilityOutput } from '@/ai/flows/ai-driven-recovery-prediction';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  outstandingAmount: z.coerce.number().positive(),
  daysOverdue: z.coerce.number().int().positive(),
  customerPaymentHistory: z.string().min(1, { message: 'Required' }),
  pastRecoverySuccess: z.coerce.number().min(0).max(100),
  dcaPerformance: z.coerce.number().min(0).max(100),
});

interface PredictRecoveryProps {
  defaultValues: PredictRecoveryProbabilityInput;
}

export function PredictRecovery({ defaultValues }: PredictRecoveryProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictRecoveryProbabilityOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      customerPaymentHistory: 'Some late payments, but generally pays in full.'
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const output = await predictRecoveryProbability(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to predict recovery. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Driven Recovery Prediction</CardTitle>
        <CardDescription>Predict the probability of recovery and expected amount for this case.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             {/* Form fields can be added here if they need to be editable */}
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Predict Recovery
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-6 rounded-lg border bg-secondary/50 p-4">
            <h4 className="font-semibold text-lg mb-2">AI Recovery Prediction</h4>
            <div className="space-y-2">
              <p><strong>Recovery Probability:</strong> {result.recoveryProbability.toFixed(2)}%</p>
              <p><strong>Expected Recovery Amount:</strong> {result.expectedRecoveryAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
