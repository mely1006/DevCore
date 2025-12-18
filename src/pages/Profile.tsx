import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRole } from '../context/RoleContext';

export const Profile: React.FC = () => {
  const { userName, role } = useRole();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'directeur':
        return 'Directeur des Études';
      case 'formateur':
        return 'Formateur';
      case 'etudiant':
        return 'Étudiant';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
          Mon profil
        </h1>
        <p className="text-gray-600">
          Gérer vos informations personnelles
        </p>
      </div>

      <Card className="bg-card text-card-foreground border-gray-200">
        <CardHeader>
          <CardTitle className="text-foreground">Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button 
                variant="outline"
                className="bg-transparent text-foreground border-gray-300 hover:bg-gray-100 hover:text-foreground"
              >
                Changer la photo
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-foreground">Prénom</Label>
                <Input
                  id="firstName"
                  defaultValue="Jean"
                  className="bg-gray-50 border-gray-200 text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-foreground">Nom</Label>
                <Input
                  id="lastName"
                  defaultValue="Dupont"
                  className="bg-gray-50 border-gray-200 text-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="jean.dupont@univ.ma"
                className="bg-gray-50 border-gray-200 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-foreground">Rôle</Label>
              <Input
                id="role"
                defaultValue={getRoleLabel(role)}
                disabled
                className="bg-gray-100 border-gray-200 text-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                defaultValue="+212 6 12 34 56 78"
                className="bg-gray-50 border-gray-200 text-foreground"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
            >
              Enregistrer les modifications
            </Button>
            <Button 
              variant="outline"
              className="bg-transparent text-foreground border-gray-300 hover:bg-gray-100 hover:text-foreground"
            >
              Annuler
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card text-card-foreground border-gray-200">
        <CardHeader>
          <CardTitle className="text-foreground">Sécurité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-foreground">Mot de passe actuel</Label>
            <Input
              id="currentPassword"
              type="password"
              className="bg-gray-50 border-gray-200 text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-foreground">Nouveau mot de passe</Label>
            <Input
              id="newPassword"
              type="password"
              className="bg-gray-50 border-gray-200 text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              className="bg-gray-50 border-gray-200 text-foreground"
            />
          </div>

          <Button 
            className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
          >
            Changer le mot de passe
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
