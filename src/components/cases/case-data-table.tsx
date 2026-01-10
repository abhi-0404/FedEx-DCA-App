'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DataTableRowActions } from './data-table-row-actions';
import type { Case, CaseStatus, CasePriority, DCA, User } from '@/lib/types';
import { DCAS, USERS } from '@/lib/data';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CaseDataTableProps {
  data: Case[];
}

type SortKey = keyof Case | '';

const priorityVariant: { [key in CasePriority]: "destructive" | "default" | "secondary" } = {
  High: 'destructive',
  Medium: 'default',
  Low: 'secondary',
};

export function CaseDataTable({ data }: CaseDataTableProps) {
  const [filter, setFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<CaseStatus | 'all'>('all');
  const [sortKey, setSortKey] = React.useState<SortKey>('createdAt');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;
      
      let compare = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        compare = aValue - bValue;
      } else {
        compare = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === 'asc' ? compare : -compare;
    });
  }, [data, sortKey, sortDirection]);

  const filteredData = React.useMemo(() => {
    return sortedData.filter(item => {
      const statusMatch = statusFilter === 'all' || item.status === statusFilter;
      const textMatch = filter === '' || 
        item.id.toLowerCase().includes(filter.toLowerCase()) ||
        item.customerName.toLowerCase().includes(filter.toLowerCase());
      return statusMatch && textMatch;
    });
  }, [sortedData, filter, statusFilter]);
  
  const getDcaName = (id?: string) => DCAS.find(d => d.id === id)?.name || 'N/A';
  const getOwnerName = (id: string) => USERS.find(u => u.id === id)?.name || 'N/A';

  const SortableHeader = ({ tkey, label }: { tkey: SortKey; label: string }) => (
    <TableHead onClick={() => handleSort(tkey)} className="cursor-pointer">
      <div className="flex items-center gap-2">
        {label}
        {sortKey === tkey && (sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
      </div>
    </TableHead>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter by case ID or customer..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as CaseStatus | 'all')}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Assigned">Assigned</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Promised to Pay">Promised to Pay</SelectItem>
                <SelectItem value="Recovered">Recovered</SelectItem>
                <SelectItem value="Escalated">Escalated</SelectItem>
            </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case ID</TableHead>
              <TableHead>Customer</TableHead>
              <SortableHeader tkey="outstandingAmount" label="Amount" />
              <SortableHeader tkey="daysOverdue" label="Days Overdue" />
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>DCA</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.id}</TableCell>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: row.currency,
                    }).format(row.outstandingAmount)}
                  </TableCell>
                  <TableCell>{row.daysOverdue}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityVariant[row.priority]}>{row.priority}</Badge>
                  </TableCell>
                  <TableCell>{getDcaName(row.assignedDcaId)}</TableCell>
                  <TableCell>{getOwnerName(row.fedexOwnerId)}</TableCell>
                  <TableCell>
                    <DataTableRowActions row={row} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
