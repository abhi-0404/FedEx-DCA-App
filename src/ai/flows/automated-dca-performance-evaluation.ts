'use server';
/**
 * @fileOverview A flow that evaluates the performance of Debt Collection Agencies (DCAs) based on various metrics.
 *
 * - evaluateDcaPerformance - A function that triggers the DCA performance evaluation process.
 * - EvaluateDcaPerformanceInput - The input type for the evaluateDcaPerformance function.
 * - EvaluateDcaPerformanceOutput - The return type for the evaluateDcaPerformance function, providing a performance score and ranking.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateDcaPerformanceInputSchema = z.object({
  dcaId: z.string().describe('The ID of the Debt Collection Agency to evaluate.'),
  recoveryRate: z.number().describe('The recovery rate of the DCA (percentage).'),
  slaComplianceRate: z.number().describe('The SLA compliance rate of the DCA (percentage).'),
  averageRecoveryTime: z.number().describe('The average time taken by the DCA to recover a debt (in days).'),
  successByCaseType: z.record(z.string(), z.number()).describe('A record of success rates by case type.'),
});
export type EvaluateDcaPerformanceInput = z.infer<typeof EvaluateDcaPerformanceInputSchema>;

const EvaluateDcaPerformanceOutputSchema = z.object({
  performanceScore: z.number().describe('A numerical score representing the overall performance of the DCA.'),
  ranking: z.string().describe('A qualitative ranking of the DCA (e.g., Top Performer, Average, Poor Performer).'),
  summary: z.string().describe('A summary of the DCA performance evaluation.')
});
export type EvaluateDcaPerformanceOutput = z.infer<typeof EvaluateDcaPerformanceOutputSchema>;

export async function evaluateDcaPerformance(input: EvaluateDcaPerformanceInput): Promise<EvaluateDcaPerformanceOutput> {
  return evaluateDcaPerformanceFlow(input);
}

const evaluateDcaPerformancePrompt = ai.definePrompt({
  name: 'evaluateDcaPerformancePrompt',
  input: {schema: EvaluateDcaPerformanceInputSchema},
  output: {schema: EvaluateDcaPerformanceOutputSchema},
  prompt: `You are an expert in evaluating the performance of Debt Collection Agencies (DCAs). Given the following metrics for a specific DCA, provide a performance score (out of 100), a qualitative ranking (Top Performer, Average, Poor Performer), and a summary of their performance.

DCA ID: {{{dcaId}}}
Recovery Rate: {{{recoveryRate}}}%
SLA Compliance Rate: {{{slaComplianceRate}}}%
Average Recovery Time: {{{averageRecoveryTime}}} days
Success by Case Type: {{{successByCaseType}}}

Consider all factors, assign a performance score, rank the DCA, and summarize their strengths and weaknesses.
`,
});

const evaluateDcaPerformanceFlow = ai.defineFlow(
  {
    name: 'evaluateDcaPerformanceFlow',
    inputSchema: EvaluateDcaPerformanceInputSchema,
    outputSchema: EvaluateDcaPerformanceOutputSchema,
  },
  async input => {
    const {output} = await evaluateDcaPerformancePrompt(input);
    return output!;
  }
);
