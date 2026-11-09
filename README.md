# DebtFlow AI: Debt Collection Agency Management

A web app for managing overdue customer accounts that FedEx hands to debt collection agencies (DCAs). It brings cases, agencies and users into one dashboard and adds four AI assistants, built with Google Gemini through Firebase Genkit, that help decide which cases to work first and which agencies perform best.

> Team project. This repository is a fork of [abhisuman2001/FedEx-DCA](https://github.com/abhisuman2001/FedEx-DCA).

## What it does

| Area | What you can do |
|---|---|
| **Dashboard** | Overview of cases, outstanding amounts and recovery status with charts |
| **Cases** | Browse, filter and open cases with customer, invoice and history details |
| **DCAs** | Compare collection agencies and open each one's performance profile |
| **Users** | Manage accounts for FedEx and agency staff |
| **Profile** | View and edit your own account |

## AI assistants (Gemini 2.5 Flash via Genkit)

Each assistant is a typed Genkit flow with a Zod input and output schema, so the model's answer always comes back as structured data the UI can display.

| Flow | Inputs | Returns |
|---|---|---|
| **Case prioritization** | Outstanding amount, days overdue, payment history, invoice data, customer history, agency performance | Priority score and the reasoning behind it |
| **Recovery prediction** | Outstanding amount, days overdue, payment history, past recovery success, agency performance, expected recovery amount | Probability of recovery |
| **DCA performance evaluation** | Recovery rate, SLA compliance, average recovery time | Performance score, ranking (for example Top Performer) and a summary |
| **Escalation risk** | Case ID, days overdue, outstanding amount | Escalation risk and early-warning alerts |

The flows live in [`src/ai/flows`](src/ai/flows). The app runs on sample data from [`src/lib/data.ts`](src/lib/data.ts), so it works without a database.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) with TypeScript |
| AI | Firebase Genkit with the Google AI plugin, Gemini 2.5 Flash, Zod schemas |
| UI | Tailwind CSS, shadcn/ui (Radix primitives), Recharts |
| Hosting | Firebase App Hosting (`apphosting.yaml`) |

## Getting Started

```bash
npm install
```

Create a `.env.local` file with a Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey):

```bash
GEMINI_API_KEY=your-key-here
```

Then start the app and, optionally, the Genkit developer UI for testing the flows on their own:

```bash
npm run dev          # app on http://localhost:9002
npm run genkit:dev   # Genkit developer UI for the AI flows
```

Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`.
