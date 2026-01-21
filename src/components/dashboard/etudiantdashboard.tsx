import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, FileText, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const courses = [
  { name: 'Programmation Web', formateur: 'Prof. Martin', nextClass: '15 Jan 2024, 10:00', hasNewContent: true },
  { name: 'Base de données', formateur: 'Dr. Laurent', nextClass: '16 Jan 2024, 14:00', hasNewContent: false },
  { name: 'Algorithmique', formateur: 'Prof. Dubois', nextClass: '17 Jan 2024, 09:00', hasNewContent: true },
  { name: 'Gestion de projet', formateur: 'Mme. Bernard', nextClass: '18 Jan 2024, 11:00', hasNewContent: false },
];

const announcements = [
  { title: 'Nouveau TP disponible', course: 'Programmation Web', date: 'Il y a 2 heures' },
  { title: 'Rappel: Examen final', course: 'Base de données', date: 'Il y a 1 jour' },
  { title: 'Cours annulé', course: 'Algorithmique', date: 'Il y a 2 jours' },
];

export const EtudiantDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card text-card-foreground border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Mes cours
            </CardTitle>
            <BookOpen className="w-5 h-5 text-primary" strokeWidth={1.5} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-foreground">4</div>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Prochains cours
            </CardTitle>
            <Calendar className="w-5 h-5 text-secondary" strokeWidth={1.5} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-foreground">3</div>
            <p className="text-xs text-gray-600 mt-1">Cette semaine</p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Documents
            </CardTitle>
            <FileText className="w-5 h-5 text-accent" strokeWidth={1.5} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold text-foreground">28</div>
            <p className="text-xs text-gray-600 mt-1">Disponibles</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card text-card-foreground border-gray-200">
        <CardHeader>
          <CardTitle className="text-foreground">Mes matières</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course, index) => (
              <Card key={index} className="bg-tertiary text-tertiary-foreground border-gray-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-tertiary-foreground">{course.name}</CardTitle>
                    {course.hasNewContent && (
                      <Badge className="bg-primary text-primary-foreground border-0">
                        Nouveau
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-tertiary-foreground">
                    <p><span className="font-medium">Formateur:</span> {course.formateur}</p>
                    <p><span className="font-medium">Prochain cours:</span> {course.nextClass}</p>
                  </div>
                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
                  >
                    Accéder au cours
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card text-card-foreground border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Bell className="w-5 h-5 text-primary" strokeWidth={1.5} />
            Annonces récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{announcement.title}</p>
                  <p className="text-xs text-gray-600">{announcement.course} • {announcement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
