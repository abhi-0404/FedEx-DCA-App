'use client';

import { useUser } from '@/hooks/use-user';
import { PageHeader } from '@/components/ui/page-header';
import { DCAS } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function DcasPage() {
  const { user } = useUser();
  if (!user || user.role !== 'FedEx Admin') {
    return (
      <PageHeader
        title="Access Denied"
        description="You do not have permission to view this page."
      />
    );
  }

  return (
    <>
      <PageHeader title="DCA Management" description="View and manage Debt Collection Agencies.">
        <Button>
          <PlusCircle />
          Add DCA
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Agencies</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agency Name</TableHead>
                <TableHead>Active Cases</TableHead>
                <TableHead>Total Recovered</TableHead>
                <TableHead>Performance Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DCAS.map(dca => (
                <TableRow key={dca.id}>
                  <TableCell className="font-medium">{dca.name}</TableCell>
                  <TableCell>24</TableCell>
                  <TableCell>₹10,710,430</TableCell>
                  <TableCell>
                    <Badge variant={dca.performanceScore && dca.performanceScore > 80 ? 'default' : 'secondary'}>
                        {dca.performanceScore || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dcas/${dca.id}`} passHref legacyBehavior>
                      <Button variant="outline" size="sm" asChild>
                        <a>View Details</a>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
