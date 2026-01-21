import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Users, BookOpen } from 'lucide-react';

const enrollmentTrend = [
  { month: 'Jan', students: 820 },
  { month: 'Fév', students: 835 },
  { month: 'Mar', students: 842 },
  { month: 'Avr', students: 850 },
  { month: 'Mai', students: 856 },
];

const courseCompletion = [
  { course: 'Prog. Web', completion: 85 },
  { course: 'BDD', completion: 78 },
  { course: 'Algo', completion: 92 },
  { course: 'Gestion', completion: 88 },
  { course: 'Marketing', completion: 75 },
];

const kpis = [
  { title: 'Taux de réussite', value: '87%', trend: 'up', change: '+3%', icon: TrendingUp },
  { title: 'Taux d\'abandon', value: '5%', trend: 'down', change: '-2%', icon: TrendingDown },
  { title: 'Satisfaction étudiants', value: '4.2/5', trend: 'up', change: '+0.3', icon: Users },
  { title: 'Cours complétés', value: '156', trend: 'up', change: '+12', icon: BookOpen },
];

export const Statistics: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
          Statistiques globales
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble des performances de la plateforme
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="bg-card text-card-foreground border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {kpi.title}
                </CardTitle>
                <Icon 
                  className={`w-5 h-5 ${kpi.trend === 'up' ? 'text-success' : 'text-destructive'}`} 
                  strokeWidth={1.5} 
                />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold text-foreground">{kpi.value}</div>
                <p className={`text-xs mt-1 ${kpi.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                  {kpi.change} vs mois dernier
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card text-card-foreground border-gray-200">
          <CardHeader>
            <CardTitle className="text-foreground">Évolution des inscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                <XAxis dataKey="month" stroke="hsl(210, 10%, 20%)" />
                <YAxis stroke="hsl(210, 10%, 20%)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(0, 0%, 100%)', 
                    border: '1px solid hsl(0, 0%, 90%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 10%, 20%)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="students" 
                  stroke="hsl(340, 60%, 22%)" 
                  strokeWidth={2}
                  name="Étudiants"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-gray-200">
          <CardHeader>
            <CardTitle className="text-foreground">Taux de complétion par cours</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseCompletion}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                <XAxis dataKey="course" stroke="hsl(210, 10%, 20%)" />
                <YAxis stroke="hsl(210, 10%, 20%)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(0, 0%, 100%)', 
                    border: '1px solid hsl(0, 0%, 90%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 10%, 20%)'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="completion" 
                  fill="hsl(340, 60%, 22%)" 
                  radius={[8, 8, 0, 0]}
                  name="Complétion (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
