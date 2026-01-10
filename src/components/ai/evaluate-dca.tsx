'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { evaluateDcaPerformance, EvaluateDcaPerformanceInput, EvaluateDcaPerformanceOutput } from '@/ai/flows/automated-dca-performance-evaluation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { DCAS } from '@/lib/data';

const formSchema = z.object({
  dcaId: z.string(),
  recoveryRate: z.coerce.number().min(0).max(100),
  slaComplianceRate: z.coerce.number().min(0).max(100),
  averageRecoveryTime: z.coerce.number().int().positive(),
});

interface EvaluateDcaProps {
  dcaId: string;
}

export function EvaluateDca({ dcaId }: EvaluateDcaProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluateDcaPerformanceOutput | null>(null);
  const { toast } = useToast();
  const dca = DCAS.find(d => d.id === dcaId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dcaId: dcaId,
      recoveryRate: 75,
      slaComplianceRate: 95,
      averageRecoveryTime: 55,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    const fullInput = {
      ...values,
      successByCaseType: { 'High Value': 70, 'Medium Value': 80, 'Low Value': 75 },
    };

    try {
      const output = await evaluateDcaPerformance(fullInput);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to evaluate DCA performance. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automated DCA Performance Evaluation</CardTitle>
        <CardDescription>Evaluate the performance of {dca?.name || 'this DCA'} using AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             {/* Form fields can be added here if they need to be editable */}
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Evaluate Performance
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-6 rounded-lg border bg-secondary/50 p-4">
            <h4 className="font-semibold text-lg mb-2">AI Performance Evaluation</h4>
            <div className="space-y-2">
              <p><strong>Performance Score:</strong> {result.performanceScore} / 100</p>
              <p><strong>Ranking:</strong> <span className="font-bold text-primary">{result.ranking}</span></p>
              <p><strong>Summary:</strong> {result.summary}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
