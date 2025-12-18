import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MoreVertical, Pencil, Trash2, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Space {
  id: string;
  name: string;
  formateur: string;
  promotion: string;
  students: number;
}

const mockSpaces: Space[] = [
  { id: '1', name: 'Programmation Web', formateur: 'Prof. Martin', promotion: '2023', students: 45 },
  { id: '2', name: 'Base de données', formateur: 'Dr. Laurent', promotion: '2023', students: 38 },
  { id: '3', name: 'Algorithmique', formateur: 'Prof. Dubois', promotion: '2024', students: 42 },
  { id: '4', name: 'Gestion de projet', formateur: 'Mme. Bernard', promotion: '2024', students: 40 },
];

export const PedagogicalSpaces: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [spaces] = useState<Space[]>(mockSpaces);

  const filteredSpaces = spaces.filter(space =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.formateur.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
            Espaces pédagogiques
          </h1>
          <p className="text-gray-600">
            Gérer les matières et cours de la plateforme
          </p>
        </div>
        <Button 
          className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
        >
          <Plus className="w-5 h-5 mr-2" strokeWidth={1.5} />
          Créer un espace
        </Button>
      </div>

      <Card className="bg-card text-card-foreground border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
              <Input
                type="search"
                placeholder="Rechercher par matière ou formateur..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-12 bg-gray-50 border-gray-200 text-foreground placeholder:text-gray-400"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground">Matière</TableHead>
                <TableHead className="text-foreground">Formateur</TableHead>
                <TableHead className="text-foreground">Promotion</TableHead>
                <TableHead className="text-foreground">Étudiants</TableHead>
                <TableHead className="text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSpaces.map((space) => (
                <TableRow key={space.id}>
                  <TableCell className="font-medium text-foreground">{space.name}</TableCell>
                  <TableCell className="text-foreground">{space.formateur}</TableCell>
                  <TableCell className="text-gray-600">{space.promotion}</TableCell>
                  <TableCell className="text-gray-600">{space.students}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="bg-transparent text-foreground hover:bg-gray-100 hover:text-foreground"
                        >
                          <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover text-popover-foreground">
                        <DropdownMenuItem className="text-popover-foreground cursor-pointer">
                          <Eye className="w-4 h-4 mr-2" strokeWidth={1.5} />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-popover-foreground cursor-pointer">
                          <Pencil className="w-4 h-4 mr-2" strokeWidth={1.5} />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive cursor-pointer">
                          <Trash2 className="w-4 h-4 mr-2" strokeWidth={1.5} />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
