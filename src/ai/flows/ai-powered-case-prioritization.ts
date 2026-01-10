'use server';
/**
 * @fileOverview An AI-powered case prioritization flow.
 *
 * - prioritizeCase - A function that prioritizes a debt collection case using AI.
 * - PrioritizeCaseInput - The input type for the prioritizeCase function.
 * - PrioritizeCaseOutput - The return type for the prioritizeCase function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeCaseInputSchema = z.object({
  outstandingAmount: z.number().describe('The outstanding amount for the case.'),
  daysOverdue: z.number().describe('The number of days the payment is overdue.'),
  customerPaymentHistory: z.string().describe('A summary of the customer payment history.'),
  dcaPerformance: z.string().optional().describe('The historical performance of the debt collection agency if available.'),
  invoiceData: z.string().describe('Relevant invoice data for the case'),
  customerHistory: z.string().describe('Customer history with FedEx'),
});
export type PrioritizeCaseInput = z.infer<typeof PrioritizeCaseInputSchema>;

const PrioritizeCaseOutputSchema = z.object({
  priorityScore: z.number().describe('A score indicating the priority of the case (higher is more important).'),
  priorityTag: z.enum(['High', 'Medium', 'Low']).describe('A tag indicating the priority level of the case.'),
  reasoning: z.string().describe('Explanation of why the case was prioritized this way.')
});
export type PrioritizeCaseOutput = z.infer<typeof PrioritizeCaseOutputSchema>;

export async function prioritizeCase(input: PrioritizeCaseInput): Promise<PrioritizeCaseOutput> {
  return prioritizeCaseFlow(input);
}

const prioritizeCasePrompt = ai.definePrompt({
  name: 'prioritizeCasePrompt',
  input: {schema: PrioritizeCaseInputSchema},
  output: {schema: PrioritizeCaseOutputSchema},
  prompt: `You are an AI assistant helping FedEx prioritize debt collection cases.

  Given the following information about a case, determine its priority score and tag.

  Outstanding Amount: {{outstandingAmount}}
  Days Overdue: {{daysOverdue}}
  Customer Payment History: {{customerPaymentHistory}}
  DCA Performance: {{dcaPerformance}}
  Invoice Data: {{invoiceData}}
  Customer History: {{customerHistory}}

  Consider all factors and explain your reasoning.
  Ensure the priority score is between 0 and 100, and the priority tag is accurate.

  Reasoning:
  Priority Score: {{priorityScore}}
  Priority Tag: {{priorityTag}}
  `,
});

const prioritizeCaseFlow = ai.defineFlow(
  {
    name: 'prioritizeCaseFlow',
    inputSchema: PrioritizeCaseInputSchema,
    outputSchema: PrioritizeCaseOutputSchema,
  },
  async input => {
    const {output} = await prioritizeCasePrompt(input);
    return output!;
  }
);
