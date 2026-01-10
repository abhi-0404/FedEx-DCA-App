export type UserRole = 'FedEx Admin' | 'FedEx Employee' | 'Agency Admin' | 'Agency Employee';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  agencyId?: string;
};

export type DCA = {
  id: string;
  name: string;
  performanceScore?: number;
};

export type CaseStatus =
  | 'New'
  | 'Assigned'
  | 'In Progress'
  | 'Contacted'
  | 'Promised to Pay'
  | 'Disputed'
  | 'Escalated'
  | 'Recovered'
  | 'Settled'
  | 'Written Off';

export type CasePriority = 'High' | 'Medium' | 'Low';

export type Case = {
  id: string;
  customerId: string;
  customerName: string;
  outstandingAmount: number;
  currency: string;
  daysOverdue: number;
  status: CaseStatus;
  priority: CasePriority;
  aiPriorityScore?: number;
  recoveryProbability?: number;
  assignedDcaId?: string;
  assignedEmployeeId?: string;
  fedexOwnerId: string;
  createdAt: string;
};
