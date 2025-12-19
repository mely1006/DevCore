import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MoreVertical, Pencil, Trash2 } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import StudentModal from '@/components/modals/StudentModal';
import { getAllUsers, deleteUser } from '../lib/db';
import type { User } from '../lib/db';
import { useToast } from '@/hooks/use-toast';

export const Formateurs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Failed to load formateurs:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les formateurs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      toast({
        title: 'Formateur supprimé',
        description: 'Le formateur a été supprimé avec succès',
      });
      loadUsers();
    } catch (error) {
      console.error('Failed to delete formateur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le formateur',
        variant: 'destructive',
      });
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'directeur':
        return 'Directeur';
      case 'formateur':
        return 'Formateur';
      case 'etudiant':
        return 'Étudiant';
      default:
        return role;
    }
  };

  const filteredFormateurs = users.filter(user =>
    user.role === 'formateur' && (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
            Gestion des formateurs
          </h1>
          <p className="text-gray-600">Gérer les comptes formateurs de la plateforme</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
        >
          <Plus className="w-5 h-5 mr-2" strokeWidth={1.5} />
          Ajouter un formateur
        </Button>
      </div>

      <Card className="bg-card text-card-foreground border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
              <Input
                type="search"
                placeholder="Rechercher par nom ou email..."
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
                <TableHead className="text-foreground">Nom</TableHead>
                <TableHead className="text-foreground">Email</TableHead>
                <TableHead className="text-foreground">Téléphone</TableHead>
                <TableHead className="text-foreground">Rôle</TableHead>
                <TableHead className="text-foreground">Statut</TableHead>
                <TableHead className="text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-600">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : filteredFormateurs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-600">
                    Aucun formateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredFormateurs.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell className="text-gray-600">{user.phone || '—'}</TableCell>
                    <TableCell className="text-foreground">{getRoleLabel(user.role)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.status === 'active' ? 'bg-success text-white border-0' : 'bg-gray-400 text-white border-0'
                        }
                      >
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="bg-transparent text-foreground hover:bg-gray-100 hover:text-foreground">
                            <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover text-popover-foreground">
                          <DropdownMenuItem className="text-popover-foreground cursor-pointer">
                            <Pencil className="w-4 h-4 mr-2" strokeWidth={1.5} />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="w-4 h-4 mr-2" strokeWidth={1.5} />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          loadUsers();
        }}
        role="formateur"
      />
    </div>
  );
};

export default Formateurs;
