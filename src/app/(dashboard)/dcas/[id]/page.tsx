'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building, TrendingUp, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import { DCAS, CASES } from '@/lib/data';
import { StatCard } from '@/components/dashboard/stat-card';
import { CaseDataTable } from '@/components/cases/case-data-table';
import { Badge } from '@/components/ui/badge';


export default function DcaDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useUser();
  const dca = useMemo(() => DCAS.find(d => d.id === params.id), [params.id]);

  if (!user || user.role !== 'FedEx Admin') {
    return <PageHeader title="Access Denied" description="You don't have permission to view this page." />;
  }
  
  if (!dca) {
    return <PageHeader title="DCA Not Found" description="Could not find the requested agency." />;
  }

  const assignedCases = CASES.filter(c => c.assignedDcaId === dca.id);
  const totalOutstanding = assignedCases.reduce((acc, c) => acc + c.outstandingAmount, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  const activeCases = assignedCases.filter(c => c.status !== 'Recovered' && c.status !== 'Written Off').length;
  
  return (
    <div>
      <div className="mb-4">
        <Button variant="outline" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4" />Back to DCAs</Button>
      </div>

      <PageHeader
        title={dca.name}
        description="Detailed view of the Debt Collection Agency."
      />
      
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Outstanding"
          value={totalOutstanding}
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
          description="Across all assigned cases"
        />
        <StatCard
          title="Active Cases"
          value={`${activeCases}`}
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Total Recovered"
          value="₹10,710,430"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
                 <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                     <Badge variant={dca.performanceScore && dca.performanceScore > 80 ? 'default' : 'secondary'} className="text-xl">
                        {dca.performanceScore || 'N/A'}
                    </Badge>
                </div>
            </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Assigned Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <CaseDataTable data={assignedCases} />
        </CardContent>
      </Card>
      
    </div>
  );
}
