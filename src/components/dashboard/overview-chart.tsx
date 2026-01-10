'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

const data = [
  { name: 'Jan', total: Math.floor(Math.random() * 500000) + 100000 },
  { name: 'Feb', total: Math.floor(Math.random() * 500000) + 100000 },
  { name: 'Mar', total: Math.floor(Math.random() * 500000) + 100000 },
  { name: 'Apr', total: Math.floor(Math.random() * 500000) + 100000 },
  { name: 'May', total: Math.floor(Math.random() * 500000) + 100000 },
  { name: 'Jun', total: Math.floor(Math.random() * 500000) + 100000 },
  { name: 'Jul', total: Math.floor(Math.random() * 500000) + 100000 },
  { name: 'Aug', total: Math.floor(Math.random() * 500000) + 100000 },
  { name: 'Sep', total: Math.floor(Math.random() * 500000) + 100000 },
  { name: 'Oct', total: Math.floor(Math.random() * 500000) + 100000 },
  { name: 'Nov', total: Math.floor(Math.random() * 500000) + 100000 },
  { name: 'Dec', total: Math.floor(Math.random() * 500000) + 100000 },
];

export function OverviewChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recoveries Overview</CardTitle>
        <CardDescription>Total amount recovered per month.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${Number(value) / 1000}k`}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
               formatter={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value))}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
