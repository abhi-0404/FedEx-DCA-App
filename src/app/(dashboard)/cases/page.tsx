'use client';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { CaseDataTable } from '@/components/cases/case-data-table';
import { useUser } from '@/hooks/use-user';
import { CASES } from '@/lib/data';
import { PlusCircle } from 'lucide-react';

export default function CasesPage() {
  const { user } = useUser();

  if (!user) {
    return null;
  }
  
  const pageDetails = {
    'FedEx Admin': { title: 'All Cases', description: 'View and manage all cases in the system.' },
    'FedEx Employee': { title: 'My Created Cases', description: 'Manage cases you have created or uploaded.' },
    'Agency Admin': { title: 'Agency Cases', description: 'View and manage all cases assigned to your agency.' },
    'Agency Employee': { title: 'My Assigned Cases', description: 'Manage the cases that have been assigned to you.' },
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

  const { title, description } = pageDetails[user.role];

  return (
    <>
      <PageHeader title={title} description={description}>
        {(user.role === 'FedEx Employee' || user.role === 'FedEx Admin') && (
            <Button>
                <PlusCircle />
                Create Case
            </Button>
        )}
      </PageHeader>
      <CaseDataTable data={userCases} />
    </>
  );
}
