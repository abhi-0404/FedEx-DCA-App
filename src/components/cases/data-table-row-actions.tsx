'use client';

import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { Case } from '@/lib/types';

interface DataTableRowActionsProps {
  row: Case;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onSelect={() => router.push(`/cases/${row.id}`)}>
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem>Assign to DCA</DropdownMenuItem>
        <DropdownMenuItem>Update Status</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          Mark as Uncollectible
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
