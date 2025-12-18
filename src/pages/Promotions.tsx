import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen } from 'lucide-react';

const promotions = [
  { year: '2020', students: 180, spaces: 15 },
  { year: '2021', students: 210, spaces: 16 },
  { year: '2022', students: 195, spaces: 14 },
  { year: '2023', students: 225, spaces: 18 },
  { year: '2024', students: 246, spaces: 20 },
];

export const Promotions: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
          Promotions
        </h1>
        <p className="text-gray-600">
          Gérer les promotions par année académique
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <Card key={promo.year} className="bg-card text-card-foreground border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl font-heading text-foreground">
                Promotion {promo.year}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Users className="w-4 h-4" strokeWidth={1.5} />
                    Étudiants
                  </span>
                  <span className="font-medium text-foreground">{promo.students}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" strokeWidth={1.5} />
                    Espaces pédagogiques
                  </span>
                  <span className="font-medium text-foreground">{promo.spaces}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
                >
                  Voir étudiants
                </Button>
                <Button 
                  variant="outline"
                  className="w-full bg-transparent text-foreground border-gray-300 hover:bg-gray-100 hover:text-foreground"
                >
                  Gérer espaces
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
