'use client';

import { DollarSign, Users, Briefcase, TrendingUp } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { CaseDataTable } from '@/components/cases/case-data-table';
import { CASES } from '@/lib/data';

export default function DashboardPage() {
  const { user } = useUser();

  if (!user) {
    return null; 
  }

  const welcomeMessage: { [key: string]: string } = {
    'FedEx Admin': 'Welcome, Admin. Here is the full system overview.',
    'FedEx Employee': 'Here are your active cases and performance.',
    'Agency Admin': 'Here is your agency\'s performance overview.',
    'Agency Employee': 'Welcome! Here are your assigned cases.',
  };
  
  const userCases = CASES.filter(c => {
    switch (user.role) {
      case 'FedEx Admin': return true;
      case 'FedEx Employee': return c.fedexOwnerId === user.id;
      case 'Agency Admin': return c.assignedDcaId === user.agencyId;
      case 'Agency Employee': return c.assignedEmployeeId === user.id;
      default: return false;
    }
  });

  const totalOutstanding = userCases.reduce((acc, c) => acc + c.outstandingAmount, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  
  return (
    <>
      <PageHeader
        title={`Welcome back, ${user.name}!`}
        description={welcomeMessage[user.role]}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Outstanding"
          value={totalOutstanding}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description="Across all visible cases"
        />
        <StatCard
          title="Active Cases"
          value={`+${userCases.filter(c => c.status !== 'Recovered' && c.status !== 'Written Off').length}`}
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Recovered This Month"
          value="$12,234"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          description="+15% from last month"
        />
        {user.role === 'FedEx Admin' && (
             <StatCard
                title="Active Users"
                value="8"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
        )}
      </div>
      <div className="grid grid-cols-1 gap-8">
        {user.role === 'FedEx Admin' && <OverviewChart />}
        <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              {user.role === 'FedEx Admin' ? 'High Priority Cases' : 'Your Cases'}
            </h2>
            <CaseDataTable data={userCases.slice(0, 5)} />
        </div>
      </div>
    </>
  );
}
