'use server';

/**
 * @fileOverview Predicts the probability of recovery for each case using AI.
 *
 * - predictRecoveryProbability - A function that predicts the recovery probability.
 * - PredictRecoveryProbabilityInput - The input type for the predictRecoveryProbability function.
 * - PredictRecoveryProbabilityOutput - The return type for the predictRecoveryProbability function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictRecoveryProbabilityInputSchema = z.object({
  outstandingAmount: z.number().describe('The outstanding amount for the case.'),
  daysOverdue: z.number().describe('The number of days overdue for the case.'),
  customerPaymentHistory: z.string().describe('The customer payment history.'),
  pastRecoverySuccess: z.number().describe('Past recovery success rate (0-100).'),
  dcaPerformance: z.number().describe('DCA performance score (0-100).'),
});
export type PredictRecoveryProbabilityInput = z.infer<typeof PredictRecoveryProbabilityInputSchema>;

const PredictRecoveryProbabilityOutputSchema = z.object({
  recoveryProbability: z
    .number()
    .describe('The predicted probability of recovery (0-100).'),
  expectedRecoveryAmount: z.number().describe('The expected recovery amount.'),
});
export type PredictRecoveryProbabilityOutput = z.infer<typeof PredictRecoveryProbabilityOutputSchema>;

export async function predictRecoveryProbability(
  input: PredictRecoveryProbabilityInput
): Promise<PredictRecoveryProbabilityOutput> {
  return predictRecoveryProbabilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictRecoveryProbabilityPrompt',
  input: {schema: PredictRecoveryProbabilityInputSchema},
  output: {schema: PredictRecoveryProbabilityOutputSchema},
  prompt: `You are an AI expert in predicting debt recovery probabilities.

  Given the following information about a case, predict the probability of recovery and the expected recovery amount.

  Outstanding Amount: {{outstandingAmount}}
  Days Overdue: {{daysOverdue}}
  Customer Payment History: {{customerPaymentHistory}}
  Past Recovery Success Rate: {{pastRecoverySuccess}}
  DCA Performance Score: {{dcaPerformance}}

  Consider all factors to provide the most accurate prediction.
  Format the recoveryProbability as a number between 0 and 100 and the expectedRecoveryAmount as a number.
  Remember that the output.schema contains Zod descriptions which describe the required output format.
  `,
});

const predictRecoveryProbabilityFlow = ai.defineFlow(
  {
    name: 'predictRecoveryProbabilityFlow',
    inputSchema: PredictRecoveryProbabilityInputSchema,
    outputSchema: PredictRecoveryProbabilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
