'use client';

import { useUser } from '@/hooks/use-user';
import { PageHeader } from '@/components/ui/page-header';
import { USERS } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function UsersPage() {
  const { user } = useUser();
  if (!user || (user.role !== 'FedEx Admin' && user.role !== 'Agency Admin')) {
    return (
      <PageHeader
        title="Access Denied"
        description="You do not have permission to view this page."
      />
    );
  }

  const visibleUsers = user.role === 'FedEx Admin'
    ? USERS
    : USERS.filter(u => u.agencyId === user.agencyId);

  const title = user.role === 'FedEx Admin' ? 'User Management' : 'Team Management';
  const description = user.role === 'FedEx Admin' ? 'View and manage all users in the system.' : 'Manage employees within your agency.';
  
  return (
    <>
      <PageHeader title={title} description={description}>
        <Button>
          <PlusCircle />
          Add User
        </Button>
      </PageHeader>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleUsers.map(u => {
              const avatar = PlaceHolderImages.find(p => p.id === u.avatar);
              return (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={avatar?.imageUrl} alt={u.name} />
                      <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{u.name}</span>
                  </div>
                </TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{u.role}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
