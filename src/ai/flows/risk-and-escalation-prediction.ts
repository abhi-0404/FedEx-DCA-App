'use server';
/**
 * @fileOverview Predicts escalation risks using AI to identify patterns of no response or broken promises, providing early warnings and alerts.
 *
 * - predictEscalationRisk - A function that handles the escalation risk prediction process.
 * - PredictEscalationRiskInput - The input type for the predictEscalationRisk function.
 * - PredictEscalationRiskOutput - The return type for the predictEscalationRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictEscalationRiskInputSchema = z.object({
  caseId: z.string().describe('The ID of the case.'),
  customerResponsePatterns: z
    .string()
    .describe(
      'A description of the customer response patterns, including any instances of no response or broken promises.'
    ),
  daysOverdue: z.number().describe('The number of days the payment is overdue.'),
  outstandingAmount: z.number().describe('The outstanding amount for the case.'),
});
export type PredictEscalationRiskInput = z.infer<
  typeof PredictEscalationRiskInputSchema
>;

const PredictEscalationRiskOutputSchema = z.object({
  escalationRisk: z
    .string()
    .describe(
      'An assessment of the escalation risk (High, Medium, Low) along with reasoning.'
    ),
  alerts: z.array(z.string()).describe('A list of alerts or warnings.'),
});
export type PredictEscalationRiskOutput = z.infer<
  typeof PredictEscalationRiskOutputSchema
>;

export async function predictEscalationRisk(
  input: PredictEscalationRiskInput
): Promise<PredictEscalationRiskOutput> {
  return predictEscalationRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictEscalationRiskPrompt',
  input: {schema: PredictEscalationRiskInputSchema},
  output: {schema: PredictEscalationRiskOutputSchema},
  prompt: `You are an AI assistant helping FedEx employees predict the risk of case escalation.
  Based on the case details, including customer response patterns, days overdue, and outstanding amount, determine the escalation risk and provide alerts.

  Case ID: {{{caseId}}}
  Customer Response Patterns: {{{customerResponsePatterns}}}
  Days Overdue: {{{daysOverdue}}}
  Outstanding Amount: {{{outstandingAmount}}}

  Respond with the escalation risk (High, Medium, Low) and a list of alerts relevant to the case.  Include reasoning for the escalation risk assessment.`, // Modified the prompt to include clear instructions and context
});

const predictEscalationRiskFlow = ai.defineFlow(
  {
    name: 'predictEscalationRiskFlow',
    inputSchema: PredictEscalationRiskInputSchema,
    outputSchema: PredictEscalationRiskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
