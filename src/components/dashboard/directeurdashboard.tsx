import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, BookOpen } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const kpiData = [
  { title: 'Promotions', value: '12', icon: GraduationCap, color: 'text-primary' },
  { title: 'Formateurs', value: '45', icon: Users, color: 'text-secondary' },
  { title: 'Étudiants', value: '856', icon: Users, color: 'text-accent' },
  { title: 'Espaces pédagogiques', value: '78', icon: BookOpen, color: 'text-primary' },
];

const studentDistribution = [
  { name: '2020', students: 180 },
  { name: '2021', students: 210 },
  { name: '2022', students: 195 },
  { name: '2023', students: 225 },
  { name: '2024', students: 246 },
];

const courseParticipation = [
  { name: 'Informatique', value: 245 },
  { name: 'Gestion', value: 198 },
  { name: 'Marketing', value: 167 },
  { name: 'Finance', value: 156 },
  { name: 'RH', value: 90 },
];

const COLORS = ['hsl(340, 60%, 22%)', 'hsl(340, 55%, 32%)', 'hsl(340, 50%, 42%)', 'hsl(340, 45%, 52%)', 'hsl(340, 40%, 62%)'];

const recentActivities = [
  { action: 'Nouvel étudiant inscrit', user: 'Marie Dubois', time: 'Il y a 5 minutes' },
  { action: 'Espace pédagogique créé', user: 'Prof. Martin', time: 'Il y a 1 heure' },
  { action: 'Promotion 2024 mise à jour', user: 'Admin', time: 'Il y a 2 heures' },
  { action: 'Nouveau formateur ajouté', user: 'Dr. Laurent', time: 'Il y a 3 heures' },
];

export const DirecteurDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="bg-card text-card-foreground border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {kpi.title}
                </CardTitle>
                <Icon className={`w-5 h-5 ${kpi.color}`} strokeWidth={1.5} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold text-foreground">{kpi.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card text-card-foreground border-gray-200">
          <CardHeader>
            <CardTitle className="text-foreground">Distribution des étudiants</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                <XAxis dataKey="name" stroke="hsl(210, 10%, 20%)" />
                <YAxis stroke="hsl(210, 10%, 20%)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(0, 0%, 100%)', 
                    border: '1px solid hsl(0, 0%, 90%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 10%, 20%)'
                  }}
                />
                <Bar dataKey="students" fill="hsl(340, 60%, 22%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-gray-200">
          <CardHeader>
            <CardTitle className="text-foreground">Participation par cours</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={courseParticipation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="hsl(340, 60%, 22%)"
                  dataKey="value"
                >
                  {courseParticipation.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(0, 0%, 100%)', 
                    border: '1px solid hsl(0, 0%, 90%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 10%, 20%)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card text-card-foreground border-gray-200">
        <CardHeader>
          <CardTitle className="text-foreground">Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
