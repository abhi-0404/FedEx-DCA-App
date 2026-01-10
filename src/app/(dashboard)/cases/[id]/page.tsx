'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building, User, DollarSign, Calendar, BarChart, ShieldAlert } from 'lucide-radix';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/hooks/use-user';
import { CASES, DCAS, USERS } from '@/lib/data';
import type { Case, CasePriority } from '@/lib/types';
import { PrioritizeCase } from '@/components/ai/prioritize-case';
import { PredictRecovery } from '@/components/ai/predict-recovery';
import { EvaluateDca } from '@/components/ai/evaluate-dca';
import { PredictEscalation } from '@/components/ai/predict-escalation';

const priorityVariant: { [key in CasePriority]: "destructive" | "default" | "secondary" } = {
  High: 'destructive',
  Medium: 'default',
  Low: 'secondary',
};

function DetailItem({ icon, label, children }: { icon: React.ElementType, label: string, children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                    <div className="h-5 w-5 text-muted-foreground">{icon({})}</div>
                </div>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-semibold">{children}</p>
            </div>
        </div>
    );
}

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useUser();
  const caseData = useMemo(() => CASES.find(c => c.id === params.id), [params.id]);

  if (!user || !caseData) {
    // Or show a loading/not found state
    return null;
  }

  const dca = DCAS.find(d => d.id === caseData.assignedDcaId);
  const owner = USERS.find(u => u.id === caseData.fedexOwnerId);
  const isFedExUser = user.role.startsWith('FedEx');

  return (
    <div>
      <div className="mb-4">
        <Button variant="outline" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4" />Back to Cases</Button>
      </div>

      <PageHeader
        title={`Case Details: ${caseData.id}`}
        description={`Customer: ${caseData.customerName}`}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Case Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DetailItem icon={DollarSign} label="Outstanding Amount">
                        {caseData.outstandingAmount.toLocaleString('en-US', { style: 'currency', currency: caseData.currency })}
                    </DetailItem>
                    <DetailItem icon={Calendar} label="Days Overdue">{caseData.daysOverdue}</DetailItem>
                    <DetailItem icon={BarChart} label="Status">
                        <Badge variant="outline">{caseData.status}</Badge>
                    </DetailItem>
                    <DetailItem icon={ShieldAlert} label="Priority">
                        <Badge variant={priorityVariant[caseData.priority]}>{caseData.priority}</Badge>
                    </DetailItem>
                    <DetailItem icon={Building} label="Assigned DCA">{dca?.name || 'Unassigned'}</DetailItem>
                    <DetailItem icon={User} label="FedEx Owner">{owner?.name || 'N/A'}</DetailItem>
                </CardContent>
            </Card>

            {isFedExUser && (
                 <PrioritizeCase defaultValues={{
                    outstandingAmount: caseData.outstandingAmount,
                    daysOverdue: caseData.daysOverdue,
                    customerPaymentHistory: '',
                    invoiceData: '',
                    customerHistory: ''
                 }} />
            )}
        </div>
        
        <div className="space-y-8">
            {isFedExUser && (
                <>
                    <PredictRecovery defaultValues={{
                        outstandingAmount: caseData.outstandingAmount,
                        daysOverdue: caseData.daysOverdue,
                        customerPaymentHistory: '',
                        pastRecoverySuccess: 65,
                        dcaPerformance: dca?.performanceScore || 70,
                    }}/>

                    <PredictEscalation defaultValues={{
                        caseId: caseData.id,
                        customerResponsePatterns: '',
                        daysOverdue: caseData.daysOverdue,
                        outstandingAmount: caseData.outstandingAmount,
                    }}/>
                
                    {caseData.assignedDcaId && <EvaluateDca dcaId={caseData.assignedDcaId} />}
                </>
            )}
             {!isFedExUser && (
                <Card>
                    <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        <Button className="w-full">Update Status</Button>
                        <Button className="w-full" variant="secondary">Log Communication</Button>
                        <Button className="w-full" variant="secondary">Record Payment</Button>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
