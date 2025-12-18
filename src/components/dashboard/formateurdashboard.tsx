import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

const matieres = [
  { name: 'Programmation Web', students: 45, promotion: '2023', nextSession: '15 Jan 2024' },
  { name: 'Base de données', students: 38, promotion: '2023', nextSession: '16 Jan 2024' },
  { name: 'Algorithmique', students: 42, promotion: '2024', nextSession: '17 Jan 2024' },
];

export const FormateurDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card text-card-foreground border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Mes matières
            </CardTitle>
            <BookOpen className="w-5 h-5 text-primary" strokeWidth={1.5} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-foreground">3</div>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total étudiants
            </CardTitle>
            <Users className="w-5 h-5 text-secondary" strokeWidth={1.5} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-foreground">125</div>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Documents partagés
            </CardTitle>
            <FileText className="w-5 h-5 text-accent" strokeWidth={1.5} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-foreground">47</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card text-card-foreground border-gray-200">
        <CardHeader>
          <CardTitle className="text-foreground">Mes espaces pédagogiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matieres.map((matiere, index) => (
              <Card key={index} className="bg-tertiary text-tertiary-foreground border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-tertiary-foreground">{matiere.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-tertiary-foreground">
                    <p><span className="font-medium">Étudiants:</span> {matiere.students}</p>
                    <p><span className="font-medium">Promotion:</span> {matiere.promotion}</p>
                    <p><span className="font-medium">Prochaine session:</span> {matiere.nextSession}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
                    >
                      Voir détails
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-transparent text-tertiary-foreground border-tertiary-foreground hover:bg-secondary hover:text-secondary-foreground hover:border-secondary"
                    >
                      <Upload className="w-4 h-4" strokeWidth={1.5} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
