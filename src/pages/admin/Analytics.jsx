
import React from 'react';
import { DashboardLayout } from '@/components/Layouts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Analytics = () => {
   const pieData = [
      { name: 'Hematology', value: 400 },
      { name: 'Biochemistry', value: 300 },
      { name: 'Hormones', value: 300 },
      { name: 'Others', value: 200 },
   ];
   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

   const barData = [
      { name: 'Jan', revenue: 4000 },
      { name: 'Feb', revenue: 3000 },
      { name: 'Mar', revenue: 2000 },
      { name: 'Apr', revenue: 2780 },
      { name: 'May', revenue: 1890 },
      { name: 'Jun', revenue: 2390 },
   ];

   return (
      <DashboardLayout title="Analytics & Reports">
         <div className="grid md:grid-cols-2 gap-6">
            <Card>
               <CardHeader><CardTitle>Test Category Distribution</CardTitle></CardHeader>
               <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                           {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
               </CardContent>
            </Card>

            <Card>
               <CardHeader><CardTitle>Revenue Trend (Last 6 Months)</CardTitle></CardHeader>
               <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#1FAA59" />
                     </BarChart>
                  </ResponsiveContainer>
               </CardContent>
            </Card>
         </div>
      </DashboardLayout>
   );
};

export default Analytics;
